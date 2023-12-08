varying vec3 vRandomColor;
void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    distanceToCenter =  0.05 / distanceToCenter - 0.2;
    gl_FragColor = vec4(vRandomColor, distanceToCenter);
}