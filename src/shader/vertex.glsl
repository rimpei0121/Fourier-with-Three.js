attribute vec3 randomColor;
uniform float uTime;
uniform float uN;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uPointSize;
varying vec3 vRandomColor;
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x = mod(modelPosition.x + uTime * uSpeed, 20.0) - 10.0;
    modelPosition.y = 0.0;
    for(float i = 1.0; i < uN + 2.0; i++) {
        modelPosition.y += (uAmplitude + 0.0) * (1.0 / (2.0 * i - 1.0)) * sin((2.0 * i - 1.0) * modelPosition.x * uFrequency);
    }
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    gl_PointSize = uPointSize;
    vRandomColor = randomColor;
}