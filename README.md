🕳️ GRRT Black Hole Renderer

An interactive **3D black hole visualization** built with **HTML, JavaScript, and Three.js**, designed to explore the visual effects associated with black holes and relativistic ray tracing.

The project provides an interactive Schwarzschild/Kerr-style black hole renderer with controls for **black hole mass, spin, and accretion disk speed**.

Users can orbit around the black hole, zoom in and out, and dynamically adjust simulation parameters while observing how the visualization changes.


Overview

Black holes are among the most fascinating objects in astrophysics.

Their extreme gravity can dramatically affect the paths of light and the motion of surrounding matter.

This project was created as an attempt to visualize some of those effects interactively in a browser.

The renderer focuses on concepts associated with:

- 🕳️ Black hole event horizons
- 💫 Accretion disks
- 🌀 Black hole spin
- 🌌 Relativistic ray tracing
- 🔄 Frame dragging
- 🔭 Observer perspective
- ⚫ Schwarzschild black holes
- 🌀 Kerr black holes

The goal is not simply to create a visual animation, but to use programming as a way to explore and experiment with ideas from astrophysics and general relativity.



Features

Interactive Black Hole

The simulation presents a black hole as the central object around which the scene is rendered.

The camera can be moved around the system to observe it from different angles.


Ray-Tracing Visualization

The project is designed around **general-relativistic ray tracing (GRRT)** concepts.

Instead of treating the black hole as a simple glowing sphere, the renderer attempts to represent how light and surrounding structures behave around an extremely compact gravitational object.


Black Hole Spin

The simulation includes a **Spin** control:

```text
Spin (frame-drag)
0 ─────────────────── 1
```

Increasing the spin parameter allows the visualization to represent stronger rotational effects.

This is inspired by the **Kerr metric**, which describes the spacetime around a rotating black hole.


Mass Control

The black hole's characteristic Schwarzschild radius can be adjusted using:

```text
Mass (r_s)
```

Range:

```text
0.4 → 2.0
```

This allows experimentation with how changing the characteristic scale of the black hole affects the scene.


💫 Accretion Disk

The simulation includes a rotating accretion disk surrounding the black hole.

The disk speed can be adjusted using:

Disk speed
0 → 2

This makes it possible to experiment with different rotational speeds.


Interactive Camera

The scene supports:

- Mouse dragging to orbit
- Mouse wheel to zoom
- Pinch gestures for zooming on supported devices

This allows the black hole to be explored from different viewing angles.


Physics Concepts

This project is inspired by several concepts from black-hole physics.

Schwarzschild Black Hole

A Schwarzschild black hole describes a non-rotating, uncharged black hole.

Its characteristic radius is known as the **Schwarzschild radius**:


rₛ = 2GM / c²

where:

- `G` = gravitational constant
- `M` = mass of the black hole
- `c` = speed of light

The Schwarzschild radius represents the radius of the event horizon for a non-rotating black hole.


Kerr Black Hole

Real astrophysical black holes are expected to rotate.

A rotating black hole is described by the **Kerr solution** of Einstein's field equations.

Rotation introduces effects such as:

- Frame dragging
- An ergosphere
- Different orbital dynamics
- Asymmetric relativistic effects

The simulation therefore includes a **spin parameter** to experiment with rotational behavior.


Frame Dragging

A rotating black hole does not simply sit inside spacetime.

Its rotation causes spacetime itself to be dragged around it.

This phenomenon is known as:

**Frame dragging**

The project's spin control is intended to provide an intuitive visual representation of this concept.



Accretion Disk

The accretion disk represents matter orbiting the black hole.

Real accretion disks can contain extremely hot plasma and can emit enormous amounts of electromagnetic radiation.

In the visualization, the disk provides a useful reference for observing rotational and relativistic effects around the black hole.


Ray Tracing

A major goal of the project is exploring how light behaves around a black hole.

In ordinary 3D rendering, a camera ray generally travels in a straight line.

Near a black hole, however, spacetime curvature causes light to follow curved paths.

This produces effects such as:

- Gravitational lensing
- Distortion of the accretion disk
- Multiple apparent images of surrounding material
- The black hole shadow
- Strongly curved light paths

The project uses ray-tracing-inspired techniques to explore these visual effects.


Project Structure

A typical project structure is:

```text
black-hole-renderer/
│
├── index.html
├── script.js
├── style.css
└── README.md
```

`index.html`

The main entry point of the application.

It contains:

- The HTML document
- Simulation controls
- Canvas element
- Three.js import
- JavaScript entry point



`script.js`

Contains the main simulation and rendering logic.

This is where the black-hole scene, camera, animation, and simulation behavior are controlled.


`style.css`

Contains the visual styling for:

- Controls
- Interface
- Canvas
- Layout
- User interface elements


Technologies

The project uses:

HTML5

Provides the structure of the application and user interface.

CSS3

Handles the visual appearance of the interface.

JavaScript

Controls the simulation, animation, interaction, and rendering logic.

Three.js

The project uses **Three.js** for browser-based 3D rendering.

Three.js is loaded through a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```



Running the Project

No Python environment or package installation is required.

1. Clone the repository

```bash
git clone https://github.com/Abdurrahman-byte/3d-black-hole-simulation.git
```

2. Enter the project directory

```bash
cd black-hole-renderer
```

3. Open the project

The simplest option is to open:

```text
index.html
```

in a modern web browser.

For development, using **VS Code Live Server** or another local HTTP server is recommended.



Controls

| Control | Action |
|---|---|
| Mouse Drag | Orbit around the black hole |
| Mouse Wheel | Zoom |
| Pinch | Zoom on touch devices |
| Mass slider | Adjust characteristic black-hole scale |
| Spin slider | Adjust rotational/frame-dragging parameter |
| Disk speed | Adjust accretion-disk rotation |



User Interface

The interface provides three primary simulation controls:

```text
┌──────────────────────────────────────┐
│ Schwarzschild / Kerr Ray Tracer      │
│                                      │
│ Mass (rₛ)        ───────●────        │
│ Spin (frame-drag) ──────●────        │
│ Disk speed       ───────●────        │
│                                      │
└──────────────────────────────────────┘
```

The goal is to make the simulation parameters directly accessible so users can experiment rather than simply watch a predefined animation.



Project Goals

The main goals of this project are:

1. Explore black-hole physics through programming.
2. Experiment with interactive 3D visualization.
3. Learn how ray-tracing concepts can be represented computationally.
4. Visualize the effects associated with rotating black holes.
5. Experiment with accretion-disk behavior.
6. Improve JavaScript and Three.js skills.
7. Connect programming concepts with astrophysics.
8. Build an interactive scientific visualization that runs directly in a browser.



What I Learned

Building this project provided experience in several areas.

1. Scientific Visualization

I learned that programming can be used not only to build traditional applications, but also to visualize scientific concepts.

Instead of simply reading about black holes, I could experiment with parameters and observe their effects.


2. 3D Graphics

The project provided practical experience with:

- 3D scenes
- Cameras
- Rendering
- Animation
- Object positioning
- User interaction



3. Three.js

I gained practical experience using Three.js to create browser-based 3D visualizations.

This introduced concepts that are very different from ordinary HTML and CSS development.



4. Physics + Programming

One of the biggest lessons from this project was learning how programming and physics can work together.

Concepts such as:

```text
Mass
      ↓
Schwarzschild radius

Spin
      ↓
Rotational effects

Gravity
      ↓
Curved light paths

Accretion disk
      ↓
Visible reference structure
```

can be translated into computational models and visualizations.



5. Interactive Simulations

Rather than hard-coding a single animation, the project allows the user to modify parameters while the simulation is running.

This made me think more about simulations as **systems that respond to changing variables**.


Scientific Disclaimer

This project is an *educational and visualization experiment*, not a research-grade general-relativistic simulation.

The visual output should not automatically be interpreted as a physically exact representation of a real astrophysical black hole.

Accurate general-relativistic ray tracing requires solving photon geodesics in curved spacetime and carefully modeling quantities such as:

- The spacetime metric
- Photon trajectories
- Observer position
- Black-hole spin
- Emission models
- Doppler effects
- Gravitational redshift
- Relativistic beaming
- Accretion-disk physics

This project simplifies some of these concepts for interactive visualization and experimentation.


Future Improvements

Possible future improvements include:

- [ ] More physically accurate Kerr ray tracing
- [ ] Realistic gravitational lensing
- [ ] Black-hole shadow calculation
- [ ] Gravitational redshift
- [ ] Doppler beaming
- [ ] Relativistic disk emission
- [ ] More realistic accretion-disk textures
- [ ] Photon sphere visualization
- [ ] Ergosphere visualization
- [ ] Adjustable camera distance
- [ ] Preset Schwarzschild/Kerr configurations
- [ ] Real-time FPS/performance monitor
- [ ] Better mobile controls
- [ ] Scientific parameter readouts
- [ ] WebGL shader-based rendering
- [ ] More accurate geodesic integration

---

Why I Built This

This project sits at the intersection of two things I enjoy:

**Programming and astronomy.**

Black holes are extreme environments where gravity, spacetime, light, and physics behave in ways that are difficult to visualize using ordinary diagrams.

Building a simulation gives me a way to explore those ideas computationally.

The long-term goal is to keep improving the physical accuracy of the renderer while learning more about:

```text
Physics
   +
Mathematics
   +
Computer Graphics
   +
Programming
   =
Scientific Simulation
```



Concepts Explored

This project provides a practical starting point for exploring:

- General relativity
- Schwarzschild geometry
- Kerr geometry
- Event horizons
- Photon spheres
- Black-hole shadows
- Gravitational lensing
- Frame dragging
- Accretion disks
- Relativistic motion
- Ray tracing
- 3D computer graphics



 Author

**Abdurrahman Dada**

Electrical Engineering Student | AI/ML Developer | Astronomy & Physics Enthusiast

This project is part of my journey of combining:

**Python • AI/ML • Computer Graphics • Physics • Astronomy**

into practical programming projects.



⭐ If you found this project interesting

Feel free to experiment with the simulation, modify the parameters, and explore the code.

The best way to understand complicated physics is sometimes to **build something that lets you play with it.** 🕳️🌌
```

