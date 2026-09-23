#!/usr/bin/env bash
# Build a Developer ID signed, notarized, stapled DMG of SRT loves VLC.
# Run on Bo's Mac (Xcode + Developer ID Application certificate in the login keychain).
#
# One-time setup on the Mac:
#   1. Hardened Runtime is forced at archive time (ENABLE_HARDENED_RUNTIME=YES), so the
#      project does not need it set, but Build Settings > "Enable Hardened Runtime" = Yes
#      keeps the Xcode build identical. Notarization rejects apps without it.
#   2. Store notary credentials once (app-specific password from appleid.apple.com):
#        xcrun notarytool store-credentials srtlovesvlc-notary \
#          --apple-id you@example.com --team-id TEAMID1234
#
# Usage:
#   TEAM_ID=TEAMID1234 ./ops/mac-release-dmg.sh
# Optional env:
#   PROJECT         path to .xcodeproj (default ~/Documents/_xcode/SRTlovesVLC/SRTlovesVLC.xcodeproj)
#   SCHEME          Xcode scheme (default SRTlovesVLC)
#   NOTARY_PROFILE  notarytool keychain profile (default srtlovesvlc-notary)
#   OUT_DIR         where the DMG lands (default ./release)
#
# Output: release/SRTlovesVLC-<version>.dmg plus a .sha256 next to it, ready for
# /var/www/srtlovesvlc.com/downloads/m/<token>/ on vm100 (see the upload hint at the end).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="${PROJECT:-$HOME/Documents/_xcode/SRTlovesVLC/SRTlovesVLC.xcodeproj}"
SCHEME="${SCHEME:-SRTlovesVLC}"
TEAM_ID="${TEAM_ID:-}"
NOTARY_PROFILE="${NOTARY_PROFILE:-srtlovesvlc-notary}"
OUT_DIR="${OUT_DIR:-$ROOT/release}"
# Private fulfillment path token on vm100 (downloads/m/<token>/). The Stripe success URL points here.
MAC_TOKEN="${MAC_TOKEN:-590dff82095845eb31d0114f7a7a2269}"
WORK="$(mktemp -d /tmp/srtlovesvlc-dmg.XXXXXX)"

die() { echo "error: $*" >&2; exit 1; }
step() { printf '\n== %s\n' "$*"; }

[[ -n "$TEAM_ID" ]] || die "set TEAM_ID (10-character Apple team id)"
[[ -d "$PROJECT" ]] || die "no Xcode project at $PROJECT"
command -v xcodebuild >/dev/null || die "xcodebuild not found (install Xcode)"
security find-identity -v -p codesigning | grep -q "Developer ID Application" \
  || die "no 'Developer ID Application' certificate in the keychain"
xcrun notarytool history --keychain-profile "$NOTARY_PROFILE" >/dev/null 2>&1 \
  || die "notarytool profile '$NOTARY_PROFILE' missing; run: xcrun notarytool store-credentials $NOTARY_PROFILE --apple-id <id> --team-id $TEAM_ID"

ARCHIVE="$WORK/$SCHEME.xcarchive"
EXPORT="$WORK/export"
STAGE="$WORK/stage"

step "Archive (Release)"
# ENABLE_HARDENED_RUNTIME is forced here because notarization requires it and newer
# Xcode no longer exposes it in the capability picker (it is a build setting).
xcodebuild -project "$PROJECT" -scheme "$SCHEME" -configuration Release \
  -archivePath "$ARCHIVE" archive \
  -destination 'generic/platform=macOS' \
  DEVELOPMENT_TEAM="$TEAM_ID" \
  ENABLE_HARDENED_RUNTIME=YES | tail -3

step "Export with Developer ID signing"
cat > "$WORK/exportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>developer-id</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>signingStyle</key><string>automatic</string>
  <key>destination</key><string>export</string>
</dict>
</plist>
PLIST
xcodebuild -exportArchive -archivePath "$ARCHIVE" \
  -exportOptionsPlist "$WORK/exportOptions.plist" -exportPath "$EXPORT" | tail -3

APP="$(find "$EXPORT" -maxdepth 1 -name '*.app' | head -1)"
[[ -d "$APP" ]] || die "no .app in export output"
APP_NAME="$(basename "$APP" .app)"
VERSION="$(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' "$APP/Contents/Info.plist")"
BUILD="$(/usr/libexec/PlistBuddy -c 'Print CFBundleVersion' "$APP/Contents/Info.plist")"
echo "app: $APP_NAME $VERSION ($BUILD)"

step "Verify the app signature and hardened runtime"
codesign --verify --deep --strict --verbose=2 "$APP"
codesign -d --entitlements :- "$APP" 2>/dev/null | head -20 || true
codesign -dvv "$APP" 2>&1 | grep -q 'flags=.*runtime' || die "hardened runtime is not enabled on $APP_NAME; turn it on in Xcode and rerun"

step "Build the DMG"
mkdir -p "$STAGE" "$OUT_DIR"
cp -R "$APP" "$STAGE/"
ln -s /Applications "$STAGE/Applications"
DMG="$OUT_DIR/$APP_NAME-$VERSION.dmg"
rm -f "$DMG"
hdiutil create -volname "$APP_NAME" -srcfolder "$STAGE" -ov -format UDZO -fs HFS+ "$DMG" >/dev/null
echo "dmg: $DMG"

step "Sign the DMG"
codesign --sign "Developer ID Application" --timestamp "$DMG"
codesign --verify --verbose=2 "$DMG"

step "Notarize (waits for Apple; usually 1 to 5 minutes)"
xcrun notarytool submit "$DMG" --keychain-profile "$NOTARY_PROFILE" --wait --output-format plist > "$WORK/notary.plist"
NOTARY_STATUS="$(/usr/libexec/PlistBuddy -c 'Print status' "$WORK/notary.plist" 2>/dev/null || echo unknown)"
NOTARY_ID="$(/usr/libexec/PlistBuddy -c 'Print id' "$WORK/notary.plist" 2>/dev/null || echo unknown)"
if [[ "$NOTARY_STATUS" != "Accepted" ]]; then
  echo "notarization $NOTARY_STATUS (submission $NOTARY_ID). Log:" >&2
  xcrun notarytool log "$NOTARY_ID" --keychain-profile "$NOTARY_PROFILE" >&2 || true
  exit 1
fi

step "Staple and assess"
xcrun stapler staple "$DMG"
xcrun stapler validate "$DMG"
spctl -a -t open --context context:primary-signature -v "$DMG"

step "Checksum"
shasum -a 256 "$DMG" | tee "$DMG.sha256"

rm -rf "$WORK"

cat <<EOT

Done: $DMG
  version $VERSION ($BUILD), notarized submission $NOTARY_ID

To publish: the Mac fulfillment page already lives at
  /var/www/srtlovesvlc.com/downloads/m/$MAC_TOKEN/index.html
and links to $(basename "$DMG"). Upload next to it and fill in the checksum:
  scp "$DMG" "$DMG.sha256" vm100:/tmp/
  ssh vm100 "sudo mv /tmp/$(basename "$DMG") /tmp/$(basename "$DMG").sha256 /var/www/srtlovesvlc.com/downloads/m/$MAC_TOKEN/ \\
    && sudo sed -i 's/SHA256_PLACEHOLDER/$(cut -d' ' -f1 "$DMG.sha256")/' /var/www/srtlovesvlc.com/downloads/m/$MAC_TOKEN/index.html \\
    && sudo chown -R techex:techex /var/www/srtlovesvlc.com/downloads/m"
  curl -sI https://srtlovesvlc.com/downloads/m/$MAC_TOKEN/$(basename "$DMG") | head -1
If the version changed, also update the DMG filename in that index.html.
EOT
