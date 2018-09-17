<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Game</title>
</head>
<style>
    /* div {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
    } */
</style>
<body style="margin: 0; padding: 0;">
    <div>
        <canvas style="border: 1px solid black;" height="720" width="1080" id="canvas"></canvas> 
    </div>
   <script>
       <?php
        $s = '';
        //Import all the js files
        import('node.js');
        import('Numbers.js');
        import('Graph.js');
        import('Bubble.js');
        import('Line.js');

        import('Animation.js');
        import('Main.js');
        import('Engine.js');
        import('First.js');
        import('Camera.js');
        import('Geometry.js');
        import('RGBA.js');
        import('Sprite.js');
        import('Input.js');

        //End Imports
        echo $s; 
        function import($file) {
            $GLOBALS['s'] .= "\n\n//---------( START FILE: {$file} )---------\n\n".
                file_get_contents($file).
                "\n\n//---------( END FILE: {$file} )---------\n\n";
        }
       ?>
   </script>
</body>
</html>