# HeliCat 3D Model Rotation Guide

## Current Status

### ✅ Fixed Issues
1. **Chaos/Artifacts** - Caused by motion blur effects. Now disabled via `DISABLE_MOTION_EFFECTS = true`
2. **Orientation** - Changed from top-down to side view by removing X-axis rotation

### 🎯 Current Configuration

**File:** `helicopter.js` (lines 264-266)
```javascript
bladeModel.rotation.x = 0;  // No pitch
bladeModel.rotation.y = 0;  // No yaw
bladeModel.rotation.z = 0;  // No roll
```

## How to Adjust Orientation

### Option 1: Use the Visual Tester (Recommended)
Open `test-rotation.html` in your browser:
1. Use sliders to adjust X, Y, Z rotation in real-time
2. See immediate visual feedback
3. Click "Copy Code" to get the exact values
4. Paste into `helicopter.js` at line 264-266

### Option 2: Manual Adjustment

Edit `helicopter.js` around line 264 with these common orientations:

**Side View (current):**
```javascript
bladeModel.rotation.x = 0;
bladeModel.rotation.y = 0;
bladeModel.rotation.z = 0;
```

**Top-Down View (original):**
```javascript
bladeModel.rotation.x = Math.PI / 2;  // 90 degrees
bladeModel.rotation.y = 0;
bladeModel.rotation.z = 0;
```

**Front View:**
```javascript
bladeModel.rotation.x = 0;
bladeModel.rotation.y = Math.PI / 2;  // 90 degrees
bladeModel.rotation.z = 0;
```

**Slight Angle (3D perspective):**
```javascript
bladeModel.rotation.x = -0.12;  // ~7 degrees
bladeModel.rotation.y = 0.08;   // ~5 degrees
bladeModel.rotation.z = 0;
```

## Rotation Axis Reference

- **X-axis (Pitch):** Tilts forward/backward
- **Y-axis (Yaw/Vertical):** Turns left/right, vertical axis
- **Z-axis (Roll):** Rotates clockwise/counter-clockwise

**Animation Rotation:** Blades spin around Y-axis (vertical) like a real helicopter (`bladeMesh.rotation.y += rotationSpeed`)

## Re-enabling Motion Effects

Once you're happy with the orientation, re-enable motion blur:

**File:** `helicopter.js` (line 20)
```javascript
this.DISABLE_MOTION_EFFECTS = false; // Enable blur effects
```

## Quick Reference: Conversion

| Degrees | Radians        | Math Expression |
|---------|----------------|-----------------|
| 0°      | 0              | 0               |
| 45°     | 0.7854         | Math.PI / 4     |
| 90°     | 1.5708         | Math.PI / 2     |
| 180°    | 3.1416         | Math.PI         |
| 270°    | 4.7124         | Math.PI * 1.5   |
| 360°    | 6.2832         | Math.PI * 2     |

## Testing Files

1. **test-rotation.html** - Interactive rotation tester with sliders
2. **test-clean-glb.html** - Clean render test (no effects, debug info)
3. **test-glb.html** - Full featured test with motion blur

## Notes

- The GLB model appears to be in top-down orientation by default
- Removing the `Math.PI / 2` X rotation gives side view
- Scale is currently set to `0.8` (can be adjusted if too small/large)
- Position and final rotation are handled in `finalizeBladeSetup()`
