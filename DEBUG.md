# HeliCat Debugging Guide

## Problem
The helicopter blades are not visible on the main page.

## Debugging Steps

### Step 1: Open the Test Page
1. Open `test-threejs.html` in your browser
2. You should see:
   - A rotating orange cube
   - Spinning helicopter blades above it
   - Green status messages on the left
   - Frame counter in the console (F12)

**If this works:** Three.js is loading correctly and can render 3D graphics.
**If this fails:** There's a problem with Three.js loading or WebGL support.

### Step 2: Open the Main Page with Console
1. Open `index.html` in your browser
2. Press F12 to open Developer Console
3. Look for these messages:

#### Expected Console Output:
```
🚁 HeliCat Init - Canvas element: <canvas>
✅ THREE.js loaded: 128
✅ Scene created
📐 Container size: 500x500
📐 Renderer size: 500
✅ Renderer configured
🔧 Creating helicopter blades...
🔧 Creating blades - Step 1: Hub
✅ Hub created: [object]
✅ Blade group created
🔧 Creating blades - Step 2: Main blades
Creating 2 blades with length 2.5
✅ Blades created. Scene children count: [number]
🔴 Test red box added to scene
🎬 Starting animation loop...
✅ HeliCat initialization complete!
🎬 Frame 60 - Rendering... Speed: 0.000, Hovering: false
🎬 Frame 120 - Rendering... Speed: 0.000, Hovering: false
...
```

### Step 3: Visual Debugging
On the main page, you should now see:
- **Red border** around the helicopter container area (500x500px)
- **Blue border** around the canvas element
- **Red semi-transparent background** on the container

If you don't see these borders, the CSS isn't loading or the elements aren't being created.

### Step 4: Check for the Test Red Box
The code now adds a bright red test cube to the scene. If Three.js is working at all, you should see a red cube.

### Step 5: Hover Test
Move your cursor over the red-bordered area. Check console for:
```
🎬 Frame X - Rendering... Speed: [increasing], Hovering: true
```

## Common Issues

### Issue 1: "Canvas element not found"
- The HTML isn't loading properly
- Check that `index.html` has the `<canvas id="helicopter-canvas"></canvas>` element

### Issue 2: "THREE.js is not loaded"
- CDN link is blocked or slow
- Check internet connection
- Try opening: https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
- If it doesn't load, download Three.js locally

### Issue 3: Container size is 0x0
- CSS isn't loading
- Container is collapsed or hidden
- Check that `styles.css` is linked in HTML

### Issue 4: No console messages at all
- JavaScript error preventing script execution
- Check for errors in console (red text)
- Scripts might be in wrong order

### Issue 5: Animation not running
- Check for "🎬 Frame" messages in console
- If missing, the animate loop isn't running
- Check for JavaScript errors

## What to Report Back
Please open `index.html`, press F12, and tell me:

1. **Do you see the red and blue borders?** (Yes/No)
2. **Do you see any colored 3D objects?** (Yes/No - what color?)
3. **What console messages appear?** (Copy/paste or screenshot)
4. **Any red error messages in console?** (Copy exact text)
5. **Does test-threejs.html work?** (Yes/No)

## Quick Fixes to Try

### Try 1: Refresh the page
Sometimes the scripts don't load in the right order.

### Try 2: Hard refresh
- Windows: Ctrl + Shift + R
- Mac: Cmd + Shift + R

### Try 3: Different browser
Try Chrome, Firefox, or Edge.

### Try 4: Check WebGL
Visit: https://get.webgl.org/
If it says WebGL is not supported, your browser/GPU doesn't support 3D graphics.

## File Checklist
Make sure these files exist:
- ✅ index.html
- ✅ styles.css
- ✅ helicopter.js
- ✅ script.js
- ✅ image-Photoroom.png
- ✅ Download.mp4
- ✅ test-threejs.html (diagnostic)

## Next Steps
Based on what you find, we can:
1. Fix Three.js loading if that's the issue
2. Adjust camera position if objects are out of view
3. Fix rendering if the scene isn't updating
4. Simplify the geometry if it's too complex
