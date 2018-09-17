//Set up the canvas here
//TODO - clear all margin and padding on the body
//TODO - add in a canvas with the id canvas and heigh and width the size of the page
//TODO - branch the project here because scaling canvas is not something we are always going to want
//TODO - add max/ min canvas size
//TODO - how are we going to handle animations?
//TODO - how are we going to handle sudo 3d?

//Setup the game engine
Engine.framerate = 60;
Engine.addCamera(new Camera('canvas'), 1);
Engine.setMainCamera(1);
Engine.addInputHandler(new InputHandler('canvas'))
Engine.InputHandler.init();

//run user setup code
OnStart();

//Start the game engine
Engine.start(Update);
