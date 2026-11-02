import{E as e,U as t,V as n,a as r,ct as i,d as a,f as o,h as s,it as c,lt as l,n as u,p as d,t as f,u as p,z as m}from"./CanvasPool-cKY5xk2v.js";import{t as h}from"./canvasUtils-DkZMq3R0.js";import{t as g}from"./index-DallC6XN.js";var _=new c;function v(e,t){t.clear();let n=t.matrix;for(let n=0;n<e.length;n++){let r=e[n];if(r.globalDisplayStatus<7)continue;let i=r.renderGroup??r.parentRenderGroup;t.matrix=i?.isCachedAsTexture?_.copyFrom(i.textureOffsetInverseTransform).append(r.worldTransform):i?._parentCacheAsTextureRenderGroup?_.copyFrom(i._parentCacheAsTextureRenderGroup.inverseWorldTransform).append(r.groupTransform):r.worldTransform,t.addBounds(r.bounds)}return t.matrix=n,t}function y(e){return typeof e.getCanvasFilterString==`function`}var b=class{constructor(){this.skip=!1,this.useClip=!1,this.filters=null,this.container=null,this.bounds=new n,this.cssFilterString=``}},x=class{constructor(e){this._filterStack=[],this._filterStackIndex=0,this._savedStates=[],this._alphaMultiplier=1,this._warnedFilterTypes=new Set,this.renderer=e}push(e){let t=this._pushFilterFrame(),n=e.filterEffect.filters;if(t.skip=!1,t.useClip=!1,t.filters=n,t.container=e.container,t.cssFilterString=``,n.every(e=>!e.enabled)){t.skip=!0;return}let r=[];for(let e of n){if(!e.enabled)continue;if(!y(e)){this._warnUnsupportedFilter(e);continue}let t=e.getCanvasFilterString();t===null?this._warnUnsupportedFilter(e):t&&r.push(t)}if(r.length===0){t.skip=!0;return}t.cssFilterString=r.join(` `),this._calculateFilterArea(e,t.bounds),t.useClip=!!e.filterEffect.filterArea;let i=this.renderer.canvasContext.activeContext,a=i.filter||`none`;if(this._savedStates.push({filter:a,alphaMultiplier:this._alphaMultiplier}),t.useClip&&Number.isFinite(t.bounds.width)&&Number.isFinite(t.bounds.height)&&t.bounds.width>0&&t.bounds.height>0){let e=this.renderer.canvasContext.activeResolution||1;i.save(),i.setTransform(1,0,0,1,0,0),i.beginPath(),i.rect(t.bounds.x*e,t.bounds.y*e,t.bounds.width*e,t.bounds.height*e),i.clip()}else t.useClip=!1;t.cssFilterString&&(i.filter=a===`none`?t.cssFilterString:`${a} ${t.cssFilterString}`)}pop(){let e=this._popFilterFrame();if(e.skip)return;let t=this._savedStates.pop();if(!t)return;let n=this.renderer.canvasContext.activeContext;e.useClip?n.restore():n.filter=t.filter,this._alphaMultiplier=t.alphaMultiplier}generateFilteredTexture({texture:e,filters:t}){if(!t?.length||t.every(e=>!e.enabled))return e;let n=[];for(let e of t){if(!e.enabled)continue;if(!y(e)){this._warnUnsupportedFilter(e);continue}let t=e.getCanvasFilterString();t===null?this._warnUnsupportedFilter(e):t&&n.push(t)}if(n.length===0)return e;let r=h.getCanvasSource(e);if(!r)return e;let i=e.frame,a=e.source._resolution??e.source.resolution??1,o=i.width,s=i.height,{canvas:c,context:l}=f.getOptimalCanvasAndContext(o,s,a);l.setTransform(1,0,0,1,0,0),l.clearRect(0,0,c.width,c.height),n.length&&(l.filter=n.join(` `));let u=i.x*a,d=i.y*a,p=o*a,m=s*a;return l.drawImage(r,u,d,p,m,0,0,p,m),l.filter=`none`,l.globalAlpha=1,g(c,o,s,a)}_calculateFilterArea(e,t){if(e.renderables?v(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){let n=(e.container.renderGroup||e.container.parentRenderGroup)?.cacheToLocalTransform;n&&t.applyMatrix(n)}}_warnUnsupportedFilter(e){let t=e?.constructor?.name||`Filter`;this._warnedFilterTypes.has(t)||(this._warnedFilterTypes.add(t),console.warn(`CanvasRenderer: filter "${t}" is not supported in Canvas2D and will be skipped.`))}get alphaMultiplier(){return this._alphaMultiplier}_pushFilterFrame(){let e=this._filterStack[this._filterStackIndex];return e||=this._filterStack[this._filterStackIndex]=new b,this._filterStackIndex++,e}_popFilterFrame(){return this._filterStackIndex<=0?this._filterStack[0]:(this._filterStackIndex--,this._filterStack[this._filterStackIndex])}destroy(){this._filterStack=null,this._savedStates=null,this._warnedFilterTypes=null,this._alphaMultiplier=1}};x.extension={type:[i.CanvasSystem],name:`filter`};var S=`in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`,C=`in vec2 vTextureCoord;
out vec4 finalColor;
uniform sampler2D uTexture;
void main() {
    finalColor = texture(uTexture, vTextureCoord);
}
`,w=`struct GlobalFilterUniforms {
  uInputSize: vec4<f32>,
  uInputPixel: vec4<f32>,
  uInputClamp: vec4<f32>,
  uOutputFrame: vec4<f32>,
  uGlobalFrame: vec4<f32>,
  uOutputTexture: vec4<f32>,
};

@group(0) @binding(0) var <uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler: sampler;

struct VSOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>
};

fn filterVertexPosition(aPosition: vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord(aPosition: vec2<f32>) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

@vertex
fn mainVertex(
  @location(0) aPosition: vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, uv);
}
`,T=class extends r{constructor(){let e=d.from({vertex:{source:w,entryPoint:`mainVertex`},fragment:{source:w,entryPoint:`mainFragment`},name:`passthrough-filter`}),t=s.from({vertex:S,fragment:C,name:`passthrough-filter`});super({gpuProgram:e,glProgram:t})}},E=class{constructor(e){this._renderer=e}push(e,t,n){this._renderer.renderPipes.batch.break(n),n.add({renderPipeId:`filter`,canBundle:!1,action:`pushFilter`,container:t,filterEffect:e})}pop(e,t,n){this._renderer.renderPipes.batch.break(n),n.add({renderPipeId:`filter`,action:`popFilter`,canBundle:!1})}execute(e){e.action===`pushFilter`?this._renderer.filter.push(e):e.action===`popFilter`&&this._renderer.filter.pop()}destroy(){this._renderer=null}};E.extension={type:[i.WebGLPipes,i.WebGPUPipes,i.CanvasPipes],name:`filter`};var D=new u({attributes:{aPosition:{buffer:new Float32Array([0,0,1,0,1,1,0,1]),format:`float32x2`,stride:8,offset:0}},indexBuffer:new Uint32Array([0,1,2,0,2,3])}),O=class{constructor(){this.skip=!1,this.inputTexture=null,this.backTexture=null,this.filters=null,this.bounds=new n,this.container=null,this.blendRequired=!1,this.outputRenderSurface=null,this.firstEnabledIndex=-1,this.lastEnabledIndex=-1}},k=class{constructor(e){this._filterStackIndex=0,this._filterStack=[],this._filterGlobalUniforms=new o({uInputSize:{value:new Float32Array(4),type:`vec4<f32>`},uInputPixel:{value:new Float32Array(4),type:`vec4<f32>`},uInputClamp:{value:new Float32Array(4),type:`vec4<f32>`},uOutputFrame:{value:new Float32Array(4),type:`vec4<f32>`},uGlobalFrame:{value:new Float32Array(4),type:`vec4<f32>`},uOutputTexture:{value:new Float32Array(4),type:`vec4<f32>`}}),this._globalFilterBindGroup=new a({}),this.renderer=e}get activeBackTexture(){return this._activeFilterData?.backTexture}push(e){let t=this.renderer,n=e.filterEffect.filters,r=this._pushFilterData();r.skip=!1,r.filters=n,r.container=e.container,r.outputRenderSurface=t.renderTarget.renderSurface;let i=t.renderTarget.renderTarget.colorTexture.source,a=i.resolution,o=i.antialias;if(n.every(e=>!e.enabled)){r.skip=!0;return}let s=r.bounds;if(this._calculateFilterArea(e,s),this._calculateFilterBounds(r,t.renderTarget.rootViewPort,o,a,1),r.skip)return;let c=this._getPreviousFilterData();this._setupFilterTextures(r,s,t,c)}generateFilteredTexture({texture:n,filters:r}){if(r.every(e=>!e.enabled))return n;let i=this._pushFilterData();this._activeFilterData=i,i.skip=!1,i.filters=r;let a=n.source,o=a.resolution,s=a.antialias,c=i.bounds;if(c.clear(),c.addRect(n.frame),this._calculateFilterBounds(i,c.rectangle,s,o,0),i.skip)return this._popFilterData(),n;i.outputRenderSurface=e.getOptimalTexture({width:c.width,height:c.height,resolution:i.resolution,antialias:i.antialias}),i.backTexture=t.EMPTY,i.inputTexture=n,this.renderer.renderTarget.finishRenderPass(),this._applyFiltersToTexture(i,!0);let l=i.outputRenderSurface;return l.source.alphaMode=`premultiplied-alpha`,this._popFilterData(),l}pop(){let t=this.renderer,n=this._popFilterData();n.skip||(t.globalUniforms.pop(),t.renderTarget.finishRenderPass(),this._activeFilterData=n,this._applyFiltersToTexture(n,!1),n.blendRequired&&e.returnTexture(n.backTexture),e.returnTexture(n.inputTexture))}getBackTexture(t,n,r){let i=t.colorTexture.source._resolution,a=e.getOptimalTexture({width:n.width,height:n.height,resolution:i}),o=n.minX,s=n.minY;r&&(o-=r.minX,s-=r.minY),o=Math.floor(o*i),s=Math.floor(s*i);let c=Math.ceil(n.width*i),l=Math.ceil(n.height*i);return this.renderer.renderTarget.copyToTexture(t,a,{x:o,y:s},{width:c,height:l},{x:0,y:0}),a}applyFilter(e,t,n,r){let i=this.renderer,a=this._activeFilterData,o=a.outputRenderSurface===n,s=this._findClosestFilterData(),c=s?s.inputTexture.source._resolution:i.renderTarget.rootRenderTarget.colorTexture.source._resolution,l=0,u=0;o&&s&&(l=s.bounds.minX,u=s.bounds.minY),this._updateFilterUniforms(t,n,a,l,u,c,o,r);let d=e.enabled?e:this._getPassthroughFilter();this._setupBindGroupsAndRender(d,t,i)}calculateSpriteMatrix(e,t){let n=this._activeFilterData,r=e.set(n.inputTexture._source.width,0,0,n.inputTexture._source.height,n.bounds.minX,n.bounds.minY),i=t.worldTransform.copyTo(c.shared),a=t.renderGroup||t.parentRenderGroup;return a&&a.cacheToLocalTransform&&i.prepend(a.cacheToLocalTransform),i.invert(),r.prepend(i),r.scale(1/t.texture.orig.width,1/t.texture.orig.height),r.translate(t.anchor.x,t.anchor.y),r}destroy(){this._passthroughFilter?.destroy(!0),this._passthroughFilter=null}_getPassthroughFilter(){return this._passthroughFilter??=new T,this._passthroughFilter}_setupBindGroupsAndRender(e,t,n){if(n.renderPipes.uniformBatch){let e=n.renderPipes.uniformBatch.getUboResource(this._filterGlobalUniforms);this._globalFilterBindGroup.setResource(e,0)}else this._globalFilterBindGroup.setResource(this._filterGlobalUniforms,0);this._globalFilterBindGroup.setResource(t.source,1),this._globalFilterBindGroup.setResource(t.source.style,2),e.groups[0]=this._globalFilterBindGroup,n.encoder.draw({geometry:D,shader:e,state:e._state,topology:`triangle-list`}),n.type===p.WEBGL&&n.renderTarget.finishRenderPass()}_setupFilterTextures(n,r,i,a){if(n.backTexture=t.EMPTY,n.inputTexture=e.getOptimalTexture({width:r.width,height:r.height,resolution:n.resolution,antialias:n.antialias}),n.blendRequired){i.renderTarget.finishRenderPass();let e=i.renderTarget.getRenderTarget(n.outputRenderSurface);n.backTexture=this.getBackTexture(e,r,a?.bounds)}i.renderTarget.bind({target:n.inputTexture,clear:!0}),i.globalUniforms.push({offset:r})}_updateFilterUniforms(e,n,r,i,a,o,s,c){let l=this._filterGlobalUniforms.uniforms,u=l.uOutputFrame,d=l.uInputSize,f=l.uInputPixel,p=l.uInputClamp,m=l.uGlobalFrame,h=l.uOutputTexture;s?(u[0]=r.bounds.minX-i,u[1]=r.bounds.minY-a):(u[0]=0,u[1]=0),u[2]=e.frame.width,u[3]=e.frame.height,d[0]=e.source.width,d[1]=e.source.height,d[2]=1/d[0],d[3]=1/d[1],f[0]=e.source.pixelWidth,f[1]=e.source.pixelHeight,f[2]=1/f[0],f[3]=1/f[1],p[0]=.5*f[2],p[1]=.5*f[3],p[2]=e.frame.width*d[2]-.5*f[2],p[3]=e.frame.height*d[3]-.5*f[3];let g=this.renderer.renderTarget.rootRenderTarget.colorTexture;m[0]=i*o,m[1]=a*o,m[2]=g.source.width*o,m[3]=g.source.height*o,n instanceof t&&(n.source.resource=null);let _=this.renderer.renderTarget.getRenderTarget(n);this.renderer.renderTarget.bind({target:n,clear:!!c}),n instanceof t?(h[0]=n.frame.width,h[1]=n.frame.height):(h[0]=_.width,h[1]=_.height),h[2]=_.isRoot?-1:1,this._filterGlobalUniforms.update()}_findClosestFilterData(){for(let e=this._filterStackIndex-1;e>=0;e--){let t=this._filterStack[e];if(!t.skip)return t}return null}_calculateFilterArea(e,t){if(e.renderables?v(e.renderables,t):e.filterEffect.filterArea?(t.clear(),t.addRect(e.filterEffect.filterArea),t.applyMatrix(e.container.worldTransform)):e.container.getFastGlobalBounds(!0,t),e.container){let n=(e.container.renderGroup||e.container.parentRenderGroup).cacheToLocalTransform;n&&t.applyMatrix(n)}}_applyFiltersToTexture(t,n){let r=t.inputTexture,i=t.bounds,a=t.filters,o=t.firstEnabledIndex,s=t.lastEnabledIndex;if(this._globalFilterBindGroup.setResource(r.source.style,2),this._globalFilterBindGroup.setResource(t.backTexture.source,3),o===s)a[o].apply(this,r,t.outputRenderSurface,n);else{let r=t.inputTexture,c=e.getOptimalTexture({width:i.width,height:i.height,resolution:r.source._resolution}),l=c;for(let e=o;e<s;e++){let t=a[e];if(!t.enabled)continue;t.apply(this,r,l,!0);let n=r;r=l,l=n}a[s].apply(this,r,t.outputRenderSurface,n),e.returnTexture(c)}}_calculateFilterBounds(e,t,n,r,i){let a=this.renderer,o=e.bounds,s=e.filters,c=1/0,l=0,u=!0,d=!1,f=!1,p=!0,h=-1,g=-1;for(let e=0;e<s.length;e++){let t=s[e];if(t.enabled){if(h===-1&&(h=e),g=e,c=Math.min(c,t.resolution===`inherit`?r:t.resolution),l+=t.padding,t.antialias===`off`?u=!1:t.antialias===`inherit`&&(u&&=n),t.clipToViewport||(p=!1),!(t.compatibleRenderers&a.type)){f=!1;break}if(t.blendRequired&&!(a.backBuffer?.useBackBuffer??!0)){m("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."),f=!1;break}f=!0,d||=t.blendRequired}}f?(p&&o.fitBounds(0,t.width/r,0,t.height/r),o.scale(c).ceil().scale(1/c).pad((l|0)*i),o.isPositive?(e.antialias=u,e.resolution=c,e.blendRequired=d,e.firstEnabledIndex=h,e.lastEnabledIndex=g):e.skip=!0):e.skip=!0}_popFilterData(){return this._filterStackIndex--,this._filterStack[this._filterStackIndex]}_getPreviousFilterData(){for(let e=this._filterStackIndex-2;e>=0;e--){let t=this._filterStack[e];if(!t.skip)return t}return null}_pushFilterData(){let e=this._filterStack[this._filterStackIndex];return e||=this._filterStack[this._filterStackIndex]=new O,this._filterStackIndex++,e}};k.extension={type:[i.WebGLSystem,i.WebGPUSystem],name:`filter`},l.add(k,x),l.add(E);