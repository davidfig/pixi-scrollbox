import{$ as e,A as t,B as n,E as r,F as i,K as a,L as o,M as s,O as c,Q as l,R as u,S as d,T as f,U as p,V as m,W as h,Z as g,a as _,at as v,b as y,c as b,ct as x,d as ee,f as S,g as te,h as ne,i as C,it as w,lt as T,n as re,nt as E,ot as ie,p as ae,r as oe,s as se,t as ce,tt as D,u as O,v as le,w as k,x as A,z as j}from"./CanvasPool-cKY5xk2v.js";var M=[];T.handleByNamedList(x.Environment,M);async function ue(e){if(!e)for(let e=0;e<M.length;e++){let t=M[e];if(t.value.test()){await t.value.load();return}}}var N;function de(){if(typeof N==`boolean`)return N;try{N=Function(`param1`,`param2`,`param3`,`return param1[param2] === param3;`)({a:`b`},`a`,`b`)===!0}catch{N=!1}return N}var P=(e=>(e[e.NONE=0]=`NONE`,e[e.COLOR=16384]=`COLOR`,e[e.STENCIL=1024]=`STENCIL`,e[e.DEPTH=256]=`DEPTH`,e[e.COLOR_DEPTH=16640]=`COLOR_DEPTH`,e[e.COLOR_STENCIL=17408]=`COLOR_STENCIL`,e[e.DEPTH_STENCIL=1280]=`DEPTH_STENCIL`,e[e.ALL=17664]=`ALL`,e))(P||{}),fe=class{constructor(e){this.items=[],this._name=e}emit(e,t,n,r,i,a,o,s){let{name:c,items:l}=this;for(let u=0,d=l.length;u<d;u++)l[u][c](e,t,n,r,i,a,o,s);return this}add(e){return e[this._name]&&(this.remove(e),this.items.push(e)),this}remove(e){let t=this.items.indexOf(e);return t!==-1&&this.items.splice(t,1),this}contains(e){return this.items.indexOf(e)!==-1}removeAll(){return this.items.length=0,this}destroy(){this.removeAll(),this.items=null,this._name=null}get empty(){return this.items.length===0}get name(){return this._name}},pe=[`init`,`destroy`,`contextChange`,`resolutionChange`,`resetState`,`renderEnd`,`renderStart`,`render`,`update`,`postrender`,`prerender`],me=class e extends ie{constructor(e){super(),this.tick=0,this.uid=D(`renderer`),this.runners=Object.create(null),this.renderPipes=Object.create(null),this._initOptions={},this._systemsHash=Object.create(null),this.type=e.type,this.name=e.name,this.config=e;let t=[...pe,...this.config.runners??[]];this._addRunners(...t),this._unsafeEvalCheck()}async init(t={}){let n=t.skipExtensionImports===!0||t.manageImports===!1;await ue(n),!n&&this.config.loaders&&await Promise.all(this.config.loaders.map(e=>e.value.load())),this._addSystems(this.config.systems),this._addPipes(this.config.renderPipes,this.config.renderPipeAdaptors);for(let e in this._systemsHash)t={...this._systemsHash[e].constructor.defaultOptions,...t};t={...e.defaultOptions,...t},this._roundPixels=+!!t.roundPixels;for(let e=0;e<this.runners.init.items.length;e++)await this.runners.init.items[e].init(t);this._initOptions=t}render(e,t){this.tick++;let r=e;if(r instanceof k&&(r={container:r},t&&(g(l,`passing a second argument is deprecated, please use render options instead`),r.target=t.renderTexture)),r.target||(r.target=this.view.renderTarget),r.target===this.view.renderTarget&&(this._lastObjectRendered=r.container,r.clearColor??(r.clearColor=this.background.colorRgba),r.clear??(r.clear=this.background.clearBeforeRender)),r.clearColor){let e=Array.isArray(r.clearColor)&&r.clearColor.length===4;r.clearColor=e?r.clearColor:n.shared.setValue(r.clearColor).toArray()}r.transform||(r.container.updateLocalTransform(),r.transform=r.container.localTransform),r.container.visible&&(r.container.enableRenderGroup(),this.runners.prerender.emit(r),this.runners.renderStart.emit(r),this.runners.render.emit(r),this.runners.renderEnd.emit(r),this.runners.postrender.emit(r))}resize(e,t,n){let r=this.view.resolution;this.view.resize(e,t,n),this.emit(`resize`,this.view.screen.width,this.view.screen.height,this.view.resolution),n!==void 0&&n!==r&&this.runners.resolutionChange.emit(n)}clear(e={}){let t=this;e.target||=t.renderTarget.renderTarget,e.clearColor||=this.background.colorRgba,e.clear??=P.ALL;let{clear:r,clearColor:i,target:a,mipLevel:o,layer:s}=e;n.shared.setValue(i??this.background.colorRgba),t.renderTarget.clear(a,r,n.shared.toArray(),o??0,s??0)}get resolution(){return this.view.resolution}set resolution(e){this.view.resolution=e,this.runners.resolutionChange.emit(e)}get width(){return this.view.texture.frame.width}get height(){return this.view.texture.frame.height}get canvas(){return this.view.canvas}get lastObjectRendered(){return this._lastObjectRendered}get renderingToScreen(){return this.renderTarget.renderingToScreen}get screen(){return this.view.screen}_addRunners(...e){e.forEach(e=>{this.runners[e]=new fe(e)})}_addSystems(e){let t;for(t in e){let n=e[t];this._addSystem(n.value,n.name)}}_addSystem(e,t){let n=new e(this);if(this[t])throw Error(`Whoops! The name "${t}" is already in use`);this[t]=n,this._systemsHash[t]=n;for(let e in this.runners)this.runners[e].add(n);return this}_addPipes(e,t){let n=t.reduce((e,t)=>(e[t.name]=t.value,e),{});e.forEach(e=>{let t=e.value,r=e.name,i=n[r];this.renderPipes[r]=new t(this,i?new i:null),this.runners.destroy.add(this.renderPipes[r])})}destroy(e=!1){this.runners.destroy.items.reverse(),this.runners.destroy.emit(e),(e===!0||typeof e==`object`&&e.releaseGlobalResources)&&u.release(),Object.values(this.runners).forEach(e=>{e.destroy()}),this._systemsHash=null,this.renderPipes=null,this.removeAllListeners()}generateTexture(e){return this.textureGenerator.generateTexture(e)}get roundPixels(){return!!this._roundPixels}_unsafeEvalCheck(){if(!de())throw Error(`Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.`)}resetState(){this.runners.resetState.emit()}};me.defaultOptions={resolution:1,failIfMajorPerformanceCaveat:!1,roundPixels:!1};var he=me,F=`8.22.0`,ge=class{static init(){globalThis.__PIXI_APP_INIT__?.(this,F)}static destroy(){}};ge.extension=x.Application;var _e=class{constructor(e){this._renderer=e}init(){globalThis.__PIXI_RENDERER_INIT__?.(this._renderer,F)}destroy(){this._renderer=null}};_e.extension={type:[x.WebGLSystem,x.WebGPUSystem],name:`initHook`,priority:-10};var ve=class{constructor(e){this.rawBinaryData=typeof e==`number`?new ArrayBuffer(e):e instanceof Uint8Array?e.buffer:e,this.uint32View=new Uint32Array(this.rawBinaryData),this.float32View=new Float32Array(this.rawBinaryData),this.size=this.rawBinaryData.byteLength}get int8View(){return this._int8View||=new Int8Array(this.rawBinaryData),this._int8View}get uint8View(){return this._uint8View||=new Uint8Array(this.rawBinaryData),this._uint8View}get int16View(){return this._int16View||=new Int16Array(this.rawBinaryData),this._int16View}get int32View(){return this._int32View||=new Int32Array(this.rawBinaryData),this._int32View}get float64View(){return this._float64Array||=new Float64Array(this.rawBinaryData),this._float64Array}get bigUint64View(){return this._bigUint64Array||=new BigUint64Array(this.rawBinaryData),this._bigUint64Array}view(e){return this[`${e}View`]}destroy(){this.rawBinaryData=null,this.uint32View=null,this.float32View=null,this.uint16View=null,this._int8View=null,this._uint8View=null,this._int16View=null,this._int32View=null,this._float64Array=null,this._bigUint64Array=null}static sizeOf(e){switch(e){case`int8`:case`uint8`:return 1;case`int16`:case`uint16`:return 2;case`int32`:case`uint32`:case`float32`:return 4;default:throw Error(`${e} isn't a valid view type`)}}};function I(e,t,n,r){if(n??=0,r??=Math.min(e.byteLength-n,t.byteLength),!(n&7)&&!(r&7)){let i=r/8;new Float64Array(t,0,i).set(new Float64Array(e,n,i))}else if(!(n&3)&&!(r&3)){let i=r/4;new Float32Array(t,0,i).set(new Float32Array(e,n,i))}else new Uint8Array(t).set(new Uint8Array(e,n,r))}var ye={normal:`normal-npm`,add:`add-npm`,screen:`screen-npm`},L=(e=>(e[e.DISABLED=0]=`DISABLED`,e[e.RENDERING_MASK_ADD=1]=`RENDERING_MASK_ADD`,e[e.MASK_ACTIVE=2]=`MASK_ACTIVE`,e[e.INVERSE_MASK_ACTIVE=3]=`INVERSE_MASK_ACTIVE`,e[e.RENDERING_MASK_REMOVE=4]=`RENDERING_MASK_REMOVE`,e[e.NONE=5]=`NONE`,e))(L||{});function be(e,t){return t.alphaMode===`no-premultiply-alpha`&&ye[e]||e}var xe=`precision mediump float;
void main(void){
float test = 0.1;
%forloop%
gl_FragColor = vec4(0.0);
}`;function Se(e){let t=``;for(let n=0;n<e;++n)n>0&&(t+=`
else `),n<e-1&&(t+=`if(test == ${n}.0){}`);return t}function Ce(e,t){if(e===0)throw Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");let n=t.createShader(t.FRAGMENT_SHADER);try{for(;;){let r=xe.replace(/%forloop%/gi,Se(e));if(t.shaderSource(n,r),t.compileShader(n),!t.getShaderParameter(n,t.COMPILE_STATUS))e=e/2|0;else break}}finally{t.deleteShader(n)}return e}var R=null;function we(){if(R)return R;let e=te();return R=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),R=Ce(R,e),e.getExtension(`WEBGL_lose_context`)?.loseContext(),R}var Te=class{constructor(){this.ids=Object.create(null),this.textures=[],this.count=0}clear(){for(let e=0;e<this.count;e++){let t=this.textures[e];this.textures[e]=null,this.ids[t.uid]=null}this.count=0}},Ee=class{constructor(){this.renderPipeId=`batch`,this.action=`startBatch`,this.start=0,this.size=0,this.textures=new Te,this.blendMode=`normal`,this.topology=`triangle-strip`,this.canBundle=!0}destroy(){this.textures=null,this.gpuBindGroup=null,this.bindGroup=null,this.batcher=null,this.elements=null}},z=[],B=0;u.register({clear:()=>{if(z.length>0)for(let e of z)e&&e.destroy();z.length=0,B=0}});function De(){return B>0?z[--B]:new Ee}function Oe(e){e.elements=null,z[B++]=e}var V=0,ke=class e{constructor(t){this.uid=D(`batcher`),this.dirty=!0,this.batchIndex=0,this.batches=[],this._elements=[],t={...e.defaultOptions,...t},t.maxTextures||(g(`v8.8.0`,`maxTextures is a required option for Batcher now, please pass it in the options`),t.maxTextures=we());let{maxTextures:n,attributesInitialSize:r,indicesInitialSize:i}=t;this.attributeBuffer=new ve(r*4),this.indexBuffer=new Uint16Array(i),this.maxTextures=n}begin(){this.elementSize=0,this.elementStart=0,this.indexSize=0,this.attributeSize=0;for(let e=0;e<this.batchIndex;e++)Oe(this.batches[e]);this.batchIndex=0,this._batchIndexStart=0,this._batchIndexSize=0,this.dirty=!0}add(e){this._elements[this.elementSize++]=e,e._indexStart=this.indexSize,e._attributeStart=this.attributeSize,e._batcher=this,this.indexSize+=e.indexSize,this.attributeSize+=e.attributeSize*this.vertexSize}checkAndUpdateTexture(e,t){let n=e._batch.textures.ids[t._source.uid];return!n&&n!==0?!1:(e._textureId=n,e.texture=t,!0)}updateElement(e){this.dirty=!0;let t=this.attributeBuffer;e.packAsQuad?this.packQuadAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId):this.packAttributes(e,t.float32View,t.uint32View,e._attributeStart,e._textureId)}break(e){let t=this._elements;if(!t[this.elementStart])return;let n=De(),r=n.textures;r.clear();let i=t[this.elementStart],a=be(i.blendMode,i.texture._source),o=i.topology;this.attributeSize*4>this.attributeBuffer.size&&this._resizeAttributeBuffer(this.attributeSize*4),this.indexSize>this.indexBuffer.length&&this._resizeIndexBuffer(this.indexSize);let s=this.attributeBuffer.float32View,c=this.attributeBuffer.uint32View,l=this.indexBuffer,u=this._batchIndexSize,d=this._batchIndexStart,f=`startBatch`,p=[],m=this.maxTextures;for(let i=this.elementStart;i<this.elementSize;++i){let h=t[i];t[i]=null;let g=h.texture._source,_=be(h.blendMode,g),v=a!==_||o!==h.topology;g._batchTick===V&&!v?(h._textureId=g._textureBindLocation,u+=h.indexSize,h.packAsQuad?(this.packQuadAttributes(h,s,c,h._attributeStart,h._textureId),this.packQuadIndex(l,h._indexStart,h._attributeStart/this.vertexSize)):(this.packAttributes(h,s,c,h._attributeStart,h._textureId),this.packIndex(h,l,h._indexStart,h._attributeStart/this.vertexSize)),h._batch=n,p.push(h)):(g._batchTick=V,(r.count>=m||v)&&(this._finishBatch(n,d,u-d,r,a,o,e,f,p),f=`renderBatch`,d=u,a=_,o=h.topology,n=De(),r=n.textures,r.clear(),p=[],++V),h._textureId=g._textureBindLocation=r.count,r.ids[g.uid]=r.count,r.textures[r.count++]=g,h._batch=n,p.push(h),u+=h.indexSize,h.packAsQuad?(this.packQuadAttributes(h,s,c,h._attributeStart,h._textureId),this.packQuadIndex(l,h._indexStart,h._attributeStart/this.vertexSize)):(this.packAttributes(h,s,c,h._attributeStart,h._textureId),this.packIndex(h,l,h._indexStart,h._attributeStart/this.vertexSize)))}r.count>0&&(this._finishBatch(n,d,u-d,r,a,o,e,f,p),d=u,++V),this.elementStart=this.elementSize,this._batchIndexStart=d,this._batchIndexSize=u}_finishBatch(e,t,n,r,i,a,o,s,c){e.gpuBindGroup=null,e.bindGroup=null,e.action=s,e.batcher=this,e.textures=r,e.blendMode=i,e.topology=a,e.start=t,e.size=n,e.elements=c,++V,this.batches[this.batchIndex++]=e,o.add(e)}finish(e){this.break(e)}ensureAttributeBuffer(e){e*4<=this.attributeBuffer.size||this._resizeAttributeBuffer(e*4)}ensureIndexBuffer(e){e<=this.indexBuffer.length||this._resizeIndexBuffer(e)}_resizeAttributeBuffer(e){let t=new ve(Math.max(e,this.attributeBuffer.size*2));I(this.attributeBuffer.rawBinaryData,t.rawBinaryData),this.attributeBuffer=t}_resizeIndexBuffer(e){let t=this.indexBuffer,n=Math.max(e,t.length*1.5);n+=n%2;let r=n>65535?new Uint32Array(n):new Uint16Array(n);if(r.BYTES_PER_ELEMENT!==t.BYTES_PER_ELEMENT)for(let e=0;e<t.length;e++)r[e]=t[e];else I(t.buffer,r.buffer);this.indexBuffer=r}packQuadIndex(e,t,n){e[t]=n+0,e[t+1]=n+1,e[t+2]=n+2,e[t+3]=n+0,e[t+4]=n+2,e[t+5]=n+3}packIndex(e,t,n,r){let i=e.indices,a=e.indexSize,o=e.indexOffset,s=e.attributeOffset;for(let e=0;e<a;e++)t[n++]=r+i[e+o]-s}destroy(e={}){if(this.batches!==null){for(let e=0;e<this.batchIndex;e++)Oe(this.batches[e]);this.batches=null,this.geometry.destroy(!0),this.geometry=null,e.shader&&(this.shader?.destroy(),this.shader=null);for(let e=0;e<this._elements.length;e++)this._elements[e]&&(this._elements[e]._batch=null);this._elements=null,this.indexBuffer=null,this.attributeBuffer.destroy(),this.attributeBuffer=null}}};ke.defaultOptions={maxTextures:null,attributesInitialSize:4,indicesInitialSize:6};var Ae=ke,je=new Float32Array(1),Me=new Uint32Array(1),Ne=class extends re{constructor(){let e=new oe({data:je,label:`attribute-batch-buffer`,usage:C.VERTEX|C.COPY_DST,shrinkToFit:!1}),t=new oe({data:Me,label:`index-batch-buffer`,usage:C.INDEX|C.COPY_DST,shrinkToFit:!1});super({attributes:{aPosition:{buffer:e,format:`float32x2`,stride:24,offset:0},aUV:{buffer:e,format:`float32x2`,stride:24,offset:8},aColor:{buffer:e,format:`unorm8x4`,stride:24,offset:16},aTextureIdAndRound:{buffer:e,format:`uint16x2`,stride:24,offset:20}},indexBuffer:t})}};function Pe(e,t,n){if(e)for(let r in e){let i=t[r.toLocaleLowerCase()];if(i){let t=e[r];r===`header`&&(t=t.replace(/@in\s+[^;]+;\s*/g,``).replace(/@out\s+[^;]+;\s*/g,``)),n&&i.push(`//----${n}----//`),i.push(t)}else j(`${r} placement hook does not exist in shader`)}}var Fe=/\{\{(.*?)\}\}/g;function Ie(e){let t={};return(e.match(Fe)?.map(e=>e.replace(/[{()}]/g,``))??[]).forEach(e=>{t[e]=[]}),t}function Le(e,t){let n,r=/@in\s+([^;]+);/g;for(;(n=r.exec(e))!==null;)t.push(n[1])}function Re(e,t,n=!1){let r=[];Le(t,r),e.forEach(e=>{e.header&&Le(e.header,r)});let i=r;n&&i.sort();let a=i.map((e,t)=>`       @location(${t}) ${e},`).join(`
`),o=t.replace(/@in\s+[^;]+;\s*/g,``);return o=o.replace(`{{in}}`,`
${a}
`),o}function ze(e,t){let n,r=/@out\s+([^;]+);/g;for(;(n=r.exec(e))!==null;)t.push(n[1])}function Be(e){let t=/\b(\w+)\s*:/g.exec(e);return t?t[1]:``}function Ve(e){return e.replace(/@.*?\s+/g,``)}function He(e,t){let n=[];ze(t,n),e.forEach(e=>{e.header&&ze(e.header,n)});let r=0,i=n.sort().map(e=>e.indexOf(`builtin`)>-1?e:`@location(${r++}) ${e}`).join(`,
`),a=n.sort().map(e=>`       var ${Ve(e)};`).join(`
`),o=`return VSOutput(
            ${n.sort().map(e=>` ${Be(e)}`).join(`,
`)});`,s=t.replace(/@out\s+[^;]+;\s*/g,``);return s=s.replace(`{{struct}}`,`
${i}
`),s=s.replace(`{{start}}`,`
${a}
`),s=s.replace(`{{return}}`,`
${o}
`),s}function Ue(e,t){let n=e;for(let e in t){let r=t[e];n=r.join(`
`).length?n.replace(`{{${e}}}`,`//-----${e} START-----//
${r.join(`
`)}
//----${e} FINISH----//`):n.replace(`{{${e}}}`,``)}return n}var H=Object.create(null),U=new Map,We=0;function Ge({template:e,bits:t}){let n=Je(e,t);if(H[n])return H[n];let{vertex:r,fragment:i}=qe(e,t);return H[n]=Ye(r,i,t),H[n]}function Ke({template:e,bits:t}){let n=Je(e,t);return H[n]||(H[n]=Ye(e.vertex,e.fragment,t)),H[n]}function qe(e,t){let n=t.map(e=>e.vertex).filter(e=>!!e),r=t.map(e=>e.fragment).filter(e=>!!e),i=Re(n,e.vertex,!0);i=He(n,i);let a=Re(r,e.fragment,!0);return{vertex:i,fragment:a}}function Je(e,t){return t.map(e=>(U.has(e)||U.set(e,We++),U.get(e))).sort((e,t)=>e-t).join(`-`)+e.vertex+e.fragment}function Ye(e,t,n){let r=Ie(e),i=Ie(t);return n.forEach(e=>{Pe(e.vertex,r,e.name),Pe(e.fragment,i,e.name)}),{vertex:Ue(e,r),fragment:Ue(t,i)}}var Xe=`
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}

        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);

        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`,Ze=`
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;

    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {

        {{start}}

        var outColor:vec4<f32>;

        {{main}}

        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`,Qe=`
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;

        {{start}}

        vColor = vec4(1.);

        {{main}}

        vUV = uv;

        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`,$e=`

    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {

        {{start}}

        vec4 outColor;

        {{main}}

        finalColor = outColor * vColor;

        {{end}}
    }
`,et={name:`global-uniforms-bit`,vertex:{header:`
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `}},tt={name:`global-uniforms-bit`,vertex:{header:`
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `}};function nt({bits:e,name:t}){let n=Ge({template:{fragment:Ze,vertex:Xe},bits:[et,...e]});return ae.from({name:t,vertex:{source:n.vertex,entryPoint:`main`},fragment:{source:n.fragment,entryPoint:`main`}})}function rt({bits:e,name:t}){return new ne({name:t,...Ke({template:{vertex:Qe,fragment:$e},bits:[tt,...e]})})}var it={name:`color-bit`,vertex:{header:`
            @in aColor: vec4<f32>;
        `,main:`
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `}},at={name:`color-bit`,vertex:{header:`
            in vec4 aColor;
        `,main:`
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `}},W={};function ot(e){let t=[];if(e===1)t.push(`@group(1) @binding(0) var textureSource1: texture_2d<f32>;`),t.push(`@group(1) @binding(1) var textureSampler1: sampler;`);else{let n=0;for(let r=0;r<e;r++)t.push(`@group(1) @binding(${n++}) var textureSource${r+1}: texture_2d<f32>;`),t.push(`@group(1) @binding(${n++}) var textureSampler${r+1}: sampler;`)}return t.join(`
`)}function st(e){let t=[];if(e===1)t.push(`outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);`);else{t.push(`switch vTextureId {`);for(let n=0;n<e;n++)n===e-1?t.push(`  default:{`):t.push(`  case ${n}:{`),t.push(`      outColor = textureSampleGrad(textureSource${n+1}, textureSampler${n+1}, vUV, uvDx, uvDy);`),t.push(`      break;}`);t.push(`}`)}return t.join(`
`)}function ct(e){return W[e]||(W[e]={name:`texture-batch-bit`,vertex:{header:`
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `},fragment:{header:`
                @in @interpolate(flat) vTextureId: u32;

                ${ot(e)}
            `,main:`
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${st(e)}
            `}}),W[e]}var G={};function lt(e){let t=[];for(let n=0;n<e;n++)n>0&&t.push(`else`),n<e-1&&t.push(`if(vTextureId < ${n}.5)`),t.push(`{`),t.push(`	outColor = texture(uTextures[${n}], vUV);`),t.push(`}`);return t.join(`
`)}function ut(e){return G[e]||(G[e]={name:`texture-batch-bit`,vertex:{header:`
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,main:`
                vTextureId = aTextureIdAndRound.y;
            `,end:`
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `},fragment:{header:`
                in float vTextureId;

                uniform sampler2D uTextures[${e}];

            `,main:`

                ${lt(e)}
            `}}),G[e]}var dt={name:`round-pixels-bit`,vertex:{header:`
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32>
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},ft={name:`round-pixels-bit`,vertex:{header:`
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `}},pt={};function mt(e){let t=pt[e];if(t)return t;let n=new Int32Array(e);for(let t=0;t<e;t++)n[t]=t;return t=pt[e]=new S({uTextures:{value:n,type:`i32`,size:e}},{isStatic:!0}),t}var ht=class extends b{constructor(e){let t=rt({name:`batch`,bits:[at,ut(e),ft]}),n=nt({name:`batch`,bits:[it,ct(e),dt]});super({glProgram:t,gpuProgram:n,resources:{batchSamplers:mt(e)}}),this.maxTextures=e}},K=null,gt=class e extends Ae{constructor(t){super(t),this.geometry=new Ne,this.name=e.extension.name,this.vertexSize=6,K??=new ht(t.maxTextures),this.shader=K}packAttributes(e,t,n,r,i){let a=i<<16|e.roundPixels&65535,o=e.transform,s=o.a,c=o.b,l=o.c,u=o.d,d=o.tx,f=o.ty,{positions:p,uvs:m}=e,h=e.color,g=e.attributeOffset,_=g+e.attributeSize;for(let e=g;e<_;e++){let i=e*2,o=p[i],g=p[i+1];t[r++]=s*o+l*g+d,t[r++]=u*g+c*o+f,t[r++]=m[i],t[r++]=m[i+1],n[r++]=h,n[r++]=a}}packQuadAttributes(e,t,n,r,i){let a=e.texture,o=e.transform,s=o.a,c=o.b,l=o.c,u=o.d,d=o.tx,f=o.ty,p=e.bounds,m=p.maxX,h=p.minX,g=p.maxY,_=p.minY,v=a.uvs,y=e.color,b=i<<16|e.roundPixels&65535;t[r+0]=s*h+l*_+d,t[r+1]=u*_+c*h+f,t[r+2]=v.x0,t[r+3]=v.y0,n[r+4]=y,n[r+5]=b,t[r+6]=s*m+l*_+d,t[r+7]=u*_+c*m+f,t[r+8]=v.x1,t[r+9]=v.y1,n[r+10]=y,n[r+11]=b,t[r+12]=s*m+l*g+d,t[r+13]=u*g+c*m+f,t[r+14]=v.x2,t[r+15]=v.y2,n[r+16]=y,n[r+17]=b,t[r+18]=s*h+l*g+d,t[r+19]=u*g+c*h+f,t[r+20]=v.x3,t[r+21]=v.y3,n[r+22]=y,n[r+23]=b}_updateMaxTextures(e){this.shader.maxTextures!==e&&(K=new ht(e),this.shader=K)}destroy(){this.shader=null,super.destroy()}};gt.extension={type:[x.Batcher],name:`default`};var _t=gt,vt=class{constructor(e){this.items=Object.create(null);let{renderer:t,type:n,onUnload:r,priority:i,name:a}=e;this._renderer=t,t.gc.addResourceHash(this,`items`,n,i??0),this._onUnload=r,this.name=a}add(e){return!this.items[e.uid]&&(this.items[e.uid]=e,e.once(`unload`,this.remove,this),e._gcLastUsed=this._renderer.gc.now,!0)}remove(e,...t){if(!this.items[e.uid])return;let n=e._gpuData[this._renderer.uid];n&&(this._onUnload?.(e,...t),e.off(`unload`,this.remove,this),n.destroy(),e._gpuData[this._renderer.uid]=null,this.items[e.uid]=null)}removeAll(...e){Object.values(this.items).forEach(t=>t&&this.remove(t,...e))}destroy(...e){this.removeAll(...e),this.items=Object.create(null),this._renderer=null,this._onUnload=null}},yt=`in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;
uniform float uChannel;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);

    float a;
    if (uChannel == 1.0) {
        a = masky.a * npmAlpha * clip;
    } else {
        float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);
        a = alphaMul * masky.r * npmAlpha * clip;
    }

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`,bt=`in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`,xt=`struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
  uChannel:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);

    var a: f32;
    if (filterUniforms.uChannel == 1.0) {
        a = mask.a * uAlpha * clip;
    } else {
        var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);
        a = alphaMul * mask.r * uAlpha * clip;
    }

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`,St=class extends _{constructor(e){let{sprite:t,...n}=e,r=new h(t.texture),i=new S({uFilterMatrix:{value:new w,type:`mat3x3<f32>`},uMaskClamp:{value:r.uClampFrame,type:`vec4<f32>`},uAlpha:{value:1,type:`f32`},uInverse:{value:+!!e.inverse,type:`f32`},uChannel:{value:+(e.channel===`alpha`),type:`f32`}}),a=ae.from({vertex:{source:xt,entryPoint:`mainVertex`},fragment:{source:xt,entryPoint:`mainFragment`}}),o=ne.from({vertex:bt,fragment:yt,name:`mask-filter`});super({...n,gpuProgram:a,glProgram:o,clipToViewport:!1,resources:{filterUniforms:i,uMaskTexture:t.texture.source}}),this.sprite=t,this._textureMatrix=r}setSprite(e){this.sprite=e;let t=this._getSafeTexture();this._textureMatrix.texture=t,this.resources.uMaskTexture=t.source}set inverse(e){this.resources.filterUniforms.uniforms.uInverse=+!!e}get inverse(){return this.resources.filterUniforms.uniforms.uInverse===1}set channel(e){this.resources.filterUniforms.uniforms.uChannel=+(e===`alpha`)}get channel(){return this.resources.filterUniforms.uniforms.uChannel===1?`alpha`:`red`}apply(e,t,n,r){let i=this._getSafeTexture();this._textureMatrix.texture=i,e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=i.source,e.applyFilter(this,t,n,r)}_getSafeTexture(){let e=this.sprite.texture;return e.destroyed||!e.source||e.source.destroyed?(j(`[MaskFilter] The mask texture was destroyed while the mask is still in use. Remove the mask before destroying its texture.`),p.EMPTY):e}destroy(e=!1){this._textureMatrix.destroy(),super.destroy(e)}};function Ct(e,t,n){let r=(e>>24&255)/255;t[n++]=(e&255)/255*r,t[n++]=(e>>8&255)/255*r,t[n++]=(e>>16&255)/255*r,t[n++]=r}var q=class{constructor(){this.batcherName=`default`,this.topology=`triangle-list`,this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}destroy(){this.reset()}},J=class e{constructor(e,t){this.state=se.for2d(),this._batchersByInstructionSet=Object.create(null),this._activeBatches=Object.create(null),this.renderer=e,this._adaptor=t,this._adaptor.init?.(this)}static getBatcher(e,t){return new this._availableBatchers[e]({maxTextures:t})}buildStart(e){let t=this._batchersByInstructionSet[e.uid];t||(t=this._batchersByInstructionSet[e.uid]=Object.create(null),t.default||(t.default=new _t({maxTextures:this.renderer.limits.maxBatchableTextures}))),this._activeBatches=t,this._activeBatch=this._activeBatches.default;for(let e in this._activeBatches)this._activeBatches[e].begin()}addToBatch(t,n){if(this._activeBatch.name!==t.batcherName){this._activeBatch.break(n);let r=this._activeBatches[t.batcherName];r||(r=this._activeBatches[t.batcherName]=e.getBatcher(t.batcherName,this.renderer.limits.maxBatchableTextures),r.begin()),this._activeBatch=r}this._activeBatch.add(t)}break(e){this._activeBatch.break(e)}buildEnd(e){this._activeBatch.break(e);let t=this._activeBatches;for(let e in t){let n=t[e],r=n.geometry;r.indexBuffer.setDataWithSize(n.indexBuffer,n.indexSize,!0),r.buffers[0].setDataWithSize(n.attributeBuffer.float32View,n.attributeSize,!1)}}upload(e){let t=this._batchersByInstructionSet[e.uid];for(let e in t){let n=t[e],r=n.geometry;n.dirty&&(n.dirty=!1,r.buffers[0].update(n.attributeSize*4))}}execute(e){if(e.action===`startBatch`){let t=e.batcher,n=t.geometry,r=t.shader;this._adaptor.start(this,n,r)}this._adaptor.execute(this,e)}destroyInstructionSet(e){let t=this._batchersByInstructionSet[e.uid];if(t){for(let e in t)t[e].destroy();delete this._batchersByInstructionSet[e.uid],this._activeBatches===t&&(this._activeBatches=Object.create(null),this._activeBatch=null)}}destroy(){this.state=null,this.renderer=null,this._adaptor=null;for(let e in this._activeBatches)this._activeBatches[e].destroy();this._activeBatches=null}};J.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`batch`},J._availableBatchers=Object.create(null);var wt=J;T.handleByMap(x.Batcher,wt._availableBatchers),T.add(_t);var Tt=new m,Et=class extends i{constructor(){super(),this._placeholderSprite=new d(p.EMPTY),this.filters=[new St({sprite:this._placeholderSprite,inverse:!1,resolution:`inherit`,antialias:`inherit`})]}get sprite(){return this.filters[0].sprite}set sprite(e){this.filters[0].setSprite(e)}get inverse(){return this.filters[0].inverse}set inverse(e){this.filters[0].inverse=e}get channel(){return this.filters[0].channel}set channel(e){this.filters[0].channel=e}reset(){this._placeholderSprite.texture=p.EMPTY,this.sprite=this._placeholderSprite}},Dt=class{constructor(e){this._activeMaskStage=[],this._usedEffects=[],this._renderer=e,e.runners.postrender.add(this)}push(e,t,n){let r=this._renderer;if(r.renderPipes.batch.break(n),n.add({renderPipeId:`alphaMask`,action:`pushMaskBegin`,mask:e,inverse:t._maskOptions.inverse,canBundle:!1,maskedContainer:t}),e.inverse=t._maskOptions.inverse,e.channel=t._maskOptions.channel??`red`,e.renderMaskToTexture){let t=e.mask;t.includeInBuild=!0,t.collectRenderables(n,r,null),t.includeInBuild=!1}r.renderPipes.batch.break(n),n.add({renderPipeId:`alphaMask`,action:`pushMaskEnd`,mask:e,maskedContainer:t,inverse:t._maskOptions.inverse,canBundle:!1})}pop(e,t,n){this._renderer.renderPipes.batch.break(n),n.add({renderPipeId:`alphaMask`,action:`popMaskEnd`,mask:e,inverse:t._maskOptions.inverse,canBundle:!1})}execute(e){let t=this._renderer,n=e.mask.renderMaskToTexture;if(e.action===`pushMaskBegin`){let i=o.get(Et);if(i.inverse=e.inverse,i.channel=e.mask.channel,n){e.mask.mask.measurable=!0;let n=s(e.mask.mask,!0,Tt);e.mask.mask.measurable=!1,n.ceil();let a=t.renderTarget.renderTarget.colorTexture.source,o=r.getOptimalTexture({width:n.width,height:n.height,resolution:a._resolution,antialias:a.antialias});t.renderTarget.push({target:o,clear:!0}),t.globalUniforms.push({offset:n,worldColor:4294967295});let c=i.sprite;c.texture=o,c.worldTransform.tx=n.minX,c.worldTransform.ty=n.minY,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer,filterTexture:o})}else i.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer})}else if(e.action===`pushMaskEnd`){let e=this._activeMaskStage[this._activeMaskStage.length-1];n&&(t.type===O.WEBGL&&t.renderTarget.finishRenderPass(),t.renderTarget.pop(),t.globalUniforms.pop()),t.filter.push({renderPipeId:`filter`,action:`pushFilter`,container:e.maskedContainer,filterEffect:e.filterEffect,canBundle:!1})}else if(e.action===`popMaskEnd`){t.filter.pop();let e=this._activeMaskStage.pop();n&&r.returnTexture(e.filterTexture),this._usedEffects.push(e.filterEffect)}}postrender(){let e=this._usedEffects;for(let t=0;t<e.length;t++)o.return(e[t]);e.length=0}destroy(){this.postrender(),this._renderer.runners.postrender.remove(this),this._renderer=null,this._activeMaskStage=null,this._usedEffects=null}};Dt.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`alphaMask`};var Ot=class{constructor(e){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=e}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(e,t,n){this._renderer.renderPipes.batch.break(n);let r=this._colorStack;r[this._colorStackIndex]=r[this._colorStackIndex-1]&e.mask;let i=this._colorStack[this._colorStackIndex];i!==this._currentColor&&(this._currentColor=i,n.add({renderPipeId:`colorMask`,colorMask:i,canBundle:!1})),this._colorStackIndex++}pop(e,t,n){this._renderer.renderPipes.batch.break(n);let r=this._colorStack;this._colorStackIndex--;let i=r[this._colorStackIndex-1];i!==this._currentColor&&(this._currentColor=i,n.add({renderPipeId:`colorMask`,colorMask:i,canBundle:!1}))}execute(e){this._renderer.colorMask.setMask(e.colorMask)}destroy(){this._renderer=null,this._colorStack=null}};Ot.extension={type:[x.WebGLPipes,x.WebGPUPipes],name:`colorMask`};var kt=class{constructor(e){this._maskHash=new WeakMap,this._renderer=e}push(e,t,n){let r=e,i=this._renderer;i.renderPipes.batch.break(n),i.renderPipes.blendMode.setBlendMode(r.mask,`none`,n),n.add({renderPipeId:`stencilMask`,action:`pushMaskBegin`,mask:e,inverse:t._maskOptions.inverse,canBundle:!1});let a=r.mask;a.includeInBuild=!0,this._maskHash.has(r)||this._maskHash.set(r,{instructionsStart:0,instructionsLength:0});let o=this._maskHash.get(r);o.instructionsStart=n.instructionSize,a.collectRenderables(n,i,null),a.includeInBuild=!1,i.renderPipes.batch.break(n),n.add({renderPipeId:`stencilMask`,action:`pushMaskEnd`,mask:e,inverse:t._maskOptions.inverse,canBundle:!1}),o.instructionsLength=n.instructionSize-o.instructionsStart-1}pop(e,t,n){let r=e,i=this._renderer;i.renderPipes.batch.break(n),i.renderPipes.blendMode.setBlendMode(r.mask,`none`,n),n.add({renderPipeId:`stencilMask`,action:`popMaskBegin`,inverse:t._maskOptions.inverse,canBundle:!1});let a=this._maskHash.get(e);for(let e=0;e<a.instructionsLength;e++)n.instructions[n.instructionSize++]=n.instructions[a.instructionsStart++];n.add({renderPipeId:`stencilMask`,action:`popMaskEnd`,canBundle:!1})}execute(e){let t=this._renderer,n=t.renderTarget.getGpuRenderTarget(t.renderTarget.renderTarget),r=n.maskStackIndex;e.action===`pushMaskBegin`?(t.renderTarget.ensureDepthStencil(),t.stencil.setStencilMode(L.RENDERING_MASK_ADD,r),r++,t.colorMask.setMask(0)):e.action===`pushMaskEnd`?(e.inverse?t.stencil.setStencilMode(L.INVERSE_MASK_ACTIVE,r):t.stencil.setStencilMode(L.MASK_ACTIVE,r),t.colorMask.setMask(15)):e.action===`popMaskBegin`?(t.colorMask.setMask(0),r===0?(t.renderTarget.clear(null,P.STENCIL),t.stencil.setStencilMode(L.DISABLED,r)):t.stencil.setStencilMode(L.RENDERING_MASK_REMOVE,r),r--):e.action===`popMaskEnd`&&(e.inverse?t.stencil.setStencilMode(L.INVERSE_MASK_ACTIVE,r):t.stencil.setStencilMode(L.MASK_ACTIVE,r),t.colorMask.setMask(15)),n.maskStackIndex=r}destroy(){this._renderer=null,this._maskHash=null}};kt.extension={type:[x.WebGLPipes,x.WebGPUPipes],name:`stencilMask`};var At=class{constructor(e){this._renderer=e}updateRenderable(){}destroyRenderable(){}validateRenderable(){return!1}addRenderable(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&e.render(this._renderer)}destroy(){this._renderer=null}};At.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`customRender`};function jt(e,t){let n=e.instructionSet,r=n.instructions;for(let e=0;e<n.instructionSize;e++){let n=r[e];t[n.renderPipeId].execute(n)}}var Mt=class{constructor(e){this._renderer=e}addRenderGroup(e,t){e.isCachedAsTexture?this._addRenderableCacheAsTexture(e,t):this._addRenderableDirect(e,t)}execute(e){e.isRenderable&&(e.isCachedAsTexture?this._executeCacheAsTexture(e):this._executeDirect(e))}destroy(){this._renderer=null}_addRenderableDirect(e,t){this._renderer.renderPipes.batch.break(t),e._batchableRenderGroup&&=(o.return(e._batchableRenderGroup),null),t.add(e)}_addRenderableCacheAsTexture(e,t){let n=e._batchableRenderGroup??=o.get(q);n.renderable=e.root,n.transform=e.root.relativeGroupTransform,n.texture=e.texture,n.bounds=e._textureBounds,t.add(e),this._renderer.renderPipes.blendMode.pushBlendMode(e,e.root.groupBlendMode,t),this._renderer.renderPipes.batch.addToBatch(n,t),this._renderer.renderPipes.blendMode.popBlendMode(t)}_executeCacheAsTexture(e){if(e.textureNeedsUpdate){e.textureNeedsUpdate=!1;let t=new w().translate(-e._textureBounds.x,-e._textureBounds.y);this._renderer.renderTarget.push({target:e.texture,clear:!0,frame:e.texture.frame}),this._renderer.globalUniforms.push({worldTransformMatrix:t,worldColor:4294967295,offset:{x:0,y:0}}),jt(e,this._renderer.renderPipes),this._renderer.renderTarget.finishRenderPass(),this._renderer.renderTarget.pop(),this._renderer.globalUniforms.pop()}e._batchableRenderGroup._batcher.updateElement(e._batchableRenderGroup),e._batchableRenderGroup._batcher.geometry.buffers[0].update()}_executeDirect(e){this._renderer.globalUniforms.push({worldTransformMatrix:e.inverseParentTextureTransform,worldColor:e.worldColorAlpha}),jt(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop()}};Mt.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`renderGroup`};var Nt=class{constructor(e){this._renderer=e}addRenderable(e,t){let n=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,n),this._renderer.renderPipes.batch.addToBatch(n,t)}updateRenderable(e){let t=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){let t=this._getGpuSprite(e);return!t._batcher.checkAndUpdateTexture(t,e._texture)}_updateBatchableSprite(e,t){t.bounds=e.visualBounds,t.texture=e._texture}_getGpuSprite(e){return e._gpuData[this._renderer.uid]||this._initGPUSprite(e)}_initGPUSprite(e){let t=new q;return t.renderable=e,t.transform=e.groupTransform,t.texture=e._texture,t.bounds=e.visualBounds,t.roundPixels=this._renderer._roundPixels|e._roundPixels,e._gpuData[this._renderer.uid]=t,t}destroy(){this._renderer=null}};Nt.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`sprite`};var Y={};T.handle(x.BlendMode,e=>{if(!e.name)throw Error(`BlendMode extension must have a name property`);Y[e.name]=e.ref},e=>{delete Y[e.name]});var Pt=class{constructor(e){this._blendModeStack=[],this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=e,this._renderer.runners.prerender.add(this)}prerender(){this._activeBlendMode=`normal`,this._isAdvanced=!1}pushBlendMode(e,t,n){this._blendModeStack.push(t),this.setBlendMode(e,t,n)}popBlendMode(e){this._blendModeStack.pop();let t=this._blendModeStack[this._activeBlendMode.length-1]??`normal`;this.setBlendMode(null,t,e)}setBlendMode(e,t,n){let r=e instanceof f;this._activeBlendMode===t?this._isAdvanced&&e&&!r&&this._renderableList?.push(e):(this._isAdvanced&&this._endAdvancedBlendMode(n),this._activeBlendMode=t,e&&(this._isAdvanced=!!Y[t],this._isAdvanced&&this._beginAdvancedBlendMode(e,n)))}_beginAdvancedBlendMode(e,t){this._renderer.renderPipes.batch.break(t);let n=this._activeBlendMode;if(!Y[n]){j(`Unable to assign BlendMode: '${n}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}let r=this._ensureFilterEffect(n),i=e instanceof f,a={renderPipeId:`filter`,action:`pushFilter`,filterEffect:r,renderables:i?null:[e],container:i?e.root:null,canBundle:!1};this._renderableList=a.renderables,t.add(a)}_ensureFilterEffect(e){let t=this._filterHash[e];return t||(t=this._filterHash[e]=new i,t.filters=[new Y[e]]),t}_endAdvancedBlendMode(e){this._isAdvanced=!1,this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:`filter`,action:`popFilter`,canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}destroy(){this._renderer=null,this._renderableList=null;for(let e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}};Pt.extension={type:[x.WebGLPipes,x.WebGPUPipes,x.CanvasPipes],name:`blendMode`};function Ft(e,t){t||=0;for(let n=t;n<e.length&&e[n];n++)e[n]=null}var It=new k,Lt=7;function Rt(e,t=!1){zt(e);let n=e.childrenToUpdate,r=e.updateTick++;for(let t in n){let i=Number(t),a=n[t],o=a.list,s=a.index;for(let t=0;t<s;t++){let n=o[t];n.parentRenderGroup===e&&n.relativeRenderGroupDepth===i&&Bt(n,r,0)}Ft(o,s),a.index=0}if(t)for(let n=0;n<e.renderGroupChildren.length;n++)Rt(e.renderGroupChildren[n],t)}function zt(e){let n=e.root,r;if(e.renderGroupParent){let i=e.renderGroupParent;e.worldTransform.appendFrom(n.relativeGroupTransform,i.worldTransform),e.worldColor=t(n.groupColor,i.worldColor),r=n.groupAlpha*i.worldAlpha}else e.worldTransform.copyFrom(n.localTransform),e.worldColor=n.localColor,r=n.localAlpha;r=r<0?0:r>1?1:r,e.worldAlpha=r,e.worldColorAlpha=e.worldColor+((r*255|0)<<24)}function Bt(e,t,n){if(t===e.updateTick)return;e.updateTick=t,e.didChange=!1;let r=e.localTransform;e.updateLocalTransform();let i=e.parent;if(i&&!i.renderGroup?(n|=e._updateFlags,e.relativeGroupTransform.appendFrom(r,i.relativeGroupTransform),n&Lt&&Vt(e,i,n)):(n=e._updateFlags,e.relativeGroupTransform.copyFrom(r),n&Lt&&Vt(e,It,n)),!e.renderGroup){let r=e.children,i=r.length;for(let e=0;e<i;e++)Bt(r[e],t,n);let a=e.parentRenderGroup,o=e;o.renderPipeId&&!a.structureDidChange&&a.updateRenderable(o)}}function Vt(e,n,r){if(r&1){e.groupColor=t(e.localColor,n.groupColor);let r=e.localAlpha*n.groupAlpha;r=r<0?0:r>1?1:r,e.groupAlpha=r,e.groupColorAlpha=e.groupColor+((r*255|0)<<24)}r&2&&(e.groupBlendMode=e.localBlendMode===`inherit`?n.groupBlendMode:e.localBlendMode),r&4&&(e.globalDisplayStatus=e.localDisplayStatus&n.globalDisplayStatus),e._updateFlags=0}function Ht(e,t){let{list:n}=e.childrenRenderablesToUpdate,r=!1;for(let i=0;i<e.childrenRenderablesToUpdate.index;i++){let e=n[i];if(r=t[e.renderPipeId].validateRenderable(e),r)break}return e.structureDidChange=r,r}var Ut=new w,Wt=class{constructor(e){this._renderer=e}render({container:e,transform:t}){let n=e.parent,r=e.renderGroup.renderGroupParent;e.parent=null,e.renderGroup.renderGroupParent=null;let i=this._renderer,a=Ut;t&&(a.copyFrom(e.renderGroup.localTransform),e.renderGroup.localTransform.copyFrom(t));let o=i.renderPipes;this._updateCachedRenderGroups(e.renderGroup,null),this._updateRenderGroups(e.renderGroup),i.globalUniforms.start({worldTransformMatrix:t?e.renderGroup.localTransform:e.renderGroup.worldTransform,worldColor:e.renderGroup.worldColorAlpha}),jt(e.renderGroup,o),o.uniformBatch&&o.uniformBatch.renderEnd(),t&&e.renderGroup.localTransform.copyFrom(a),e.parent=n,e.renderGroup.renderGroupParent=r}destroy(){this._renderer=null}_updateCachedRenderGroups(e,t){if(e._parentCacheAsTextureRenderGroup=t,e.isCachedAsTexture){if(!e.textureNeedsUpdate)return;t=e}for(let n=e.renderGroupChildren.length-1;n>=0;n--)this._updateCachedRenderGroups(e.renderGroupChildren[n],t);if(e.invalidateMatrices(),e.isCachedAsTexture){if(e.textureNeedsUpdate){let t=e.root.getLocalBounds(),n=this._renderer,i=e.textureOptions.resolution||n.view.resolution,a=e.textureOptions.antialias??n.view.antialias,o=e.textureOptions.scaleMode??`linear`,s=e.texture;t.ceil(),e.texture&&r.returnTexture(e.texture),e.texture=r.getOptimalTexture({width:t.width,height:t.height,resolution:i,antialias:a,scaleMode:o}),e._textureBounds||=new m,e._textureBounds.copyFrom(t),s!==e.texture&&e.renderGroupParent&&(e.renderGroupParent.structureDidChange=!0)}}else e.texture&&=(r.returnTexture(e.texture),null)}_updateRenderGroups(e){let t=this._renderer,n=t.renderPipes;if(e.runOnRender(t),e.instructionSet.renderPipes=n,e.structureDidChange?Ft(e.childrenRenderablesToUpdate.list,0):Ht(e,n),Rt(e),e.structureDidChange?(e.structureDidChange=!1,this._buildInstructions(e,t)):this._updateRenderables(e),e.childrenRenderablesToUpdate.index=0,t.renderPipes.batch.upload(e.instructionSet),!e.isCachedAsTexture||e.textureNeedsUpdate)for(let t=0;t<e.renderGroupChildren.length;t++)this._updateRenderGroups(e.renderGroupChildren[t])}_updateRenderables(e){let{list:t,index:n}=e.childrenRenderablesToUpdate;for(let r=0;r<n;r++){let n=t[r];n.didViewUpdate&&e.updateRenderable(n)}Ft(t,n)}_buildInstructions(e,t){let n=e.root,r=e.instructionSet;r.reset();let i=t.renderPipes?t:t.batch.renderer,a=i.renderPipes;a.batch.buildStart(r),a.blendMode.buildStart(),a.colorMask.buildStart(),n.sortableChildren&&n.sortChildren(),n.collectRenderablesWithEffects(r,i,null),a.batch.buildEnd(r),a.blendMode.buildEnd(r)}};Wt.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`renderGroup`};var Gt=class e{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new n(0),this.color=this._backgroundColor,this.alpha=1}init(t){t={...e.defaultOptions,...t},this.clearBeforeRender=t.clearBeforeRender,this.color=t.background||t.backgroundColor||this._backgroundColor,this.alpha=t.backgroundAlpha,this._backgroundColor.setAlpha(t.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){n.shared.setValue(e).alpha<1&&this._backgroundColor.alpha===1&&j(`Cannot set a transparent background on an opaque canvas. To enable transparency, set backgroundAlpha < 1 when initializing your Application.`),this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};Gt.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`background`,priority:0},Gt.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};var Kt=Gt,X={png:`image/png`,jpg:`image/jpeg`,webp:`image/webp`},qt=class e{constructor(e){this._renderer=e}_normalizeOptions(e,t={}){return e instanceof k||e instanceof p?{target:e,...t}:{...t,...e}}async image(e){let t=A.get().createImage();return t.src=await this.base64(e),t}async base64(t){t=this._normalizeOptions(t,e.defaultImageOptions);let{format:n,quality:r}=t,i=this.canvas(t);if(i.toBlob!==void 0)return new Promise((e,t)=>{i.toBlob(n=>{if(!n){t(Error(`ICanvas.toBlob failed!`));return}let r=new FileReader;r.onload=()=>e(r.result),r.onerror=t,r.readAsDataURL(n)},X[n],r)});if(i.toDataURL!==void 0)return i.toDataURL(X[n],r);if(i.convertToBlob!==void 0){let e=await i.convertToBlob({type:X[n],quality:r});return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(r.result),r.onerror=n,r.readAsDataURL(e)})}throw Error(`Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented`)}canvas(e){e=this._normalizeOptions(e);let t=e.target,n=this._renderer;if(t instanceof p)return n.texture.generateCanvas(t);let r=n.textureGenerator.generateTexture(e),i=n.texture.generateCanvas(r);return r.destroy(!0),i}pixels(e){e=this._normalizeOptions(e);let t=e.target,n=this._renderer,r=t instanceof p?t:n.textureGenerator.generateTexture(e),i=n.texture.getPixels(r);return t instanceof k&&r.destroy(!0),i}texture(e){return e=this._normalizeOptions(e),e.target instanceof p?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){e=this._normalizeOptions(e);let t=this.canvas(e),n=document.createElement(`a`);n.download=e.filename??`image.png`,n.href=t.toDataURL(`image/png`),document.body.appendChild(n),n.click(),document.body.removeChild(n)}log(e){let t=e.width??200;e=this._normalizeOptions(e);let n=this.canvas(e),r=n.toDataURL();console.log(`[Pixi Texture] ${n.width}px ${n.height}px`);let i=[`font-size: 1px;`,`padding: ${t}px 300px;`,`background: url(${r}) no-repeat;`,`background-size: contain;`].join(` `);console.log(`%c `,i)}destroy(){this._renderer=null}};qt.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`extract`},qt.defaultImageOptions={format:`png`,quality:1};var Jt=qt,Yt=class e extends p{static create(t){let{dynamic:n,textureOptions:r,...i}=t;return new e({...r,source:new a(i),dynamic:n??!1})}resize(e,t,n){return this.source.resize(e,t,n),this}},Xt=new E,Zt=new m,Qt=[0,0,0,0],$t=class{constructor(e){this._renderer=e}generateTexture(e){e instanceof k&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});let t=e.resolution||this._renderer.resolution,r=e.antialias||this._renderer.view.antialias,i=e.target,a=e.clearColor;a=a?Array.isArray(a)&&a.length===4?a:n.shared.setValue(a).toArray():Qt;let o=e.frame?.copyTo(Xt)||c(i,Zt).rectangle,s=e.defaultAnchor&&{defaultAnchor:e.defaultAnchor};o.width=Math.max(o.width,1/t)|0,o.height=Math.max(o.height,1/t)|0;let l=Yt.create({...e.textureSourceOptions,width:o.width,height:o.height,resolution:t,antialias:r,textureOptions:s}),u=w.shared.translate(-o.x,-o.y);return this._renderer.render({container:i,transform:u,target:l,clearColor:a}),l.source.updateMipmaps(),l}destroy(){this._renderer=null}};$t.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`textureGenerator`};function en(e){let t=!1;for(let n in e)if(e[n]==null){t=!0;break}if(!t)return e;let n=Object.create(null);for(let t in e){let r=e[t];r&&(n[t]=r)}return n}function tn(e){let t=0;for(let n=0;n<e.length;n++)e[n]==null?t++:e[n-t]=e[n];return e.length-=t,e}var nn=class e{constructor(e){this._managedResources=[],this._managedResourceHashes=[],this._managedCollections=[],this._ready=!1,this._running=!1,this._renderer=e}init(t){t={...e.defaultOptions,...t},this.maxUnusedTime=t.gcMaxUnusedTime,this._frequency=t.gcFrequency,this.enabled=t.gcActive,this.now=performance.now()}get enabled(){return!!this._handler}set enabled(e){this.enabled!==e&&(e?(this._handler=this._renderer.scheduler.repeat(()=>{this._ready=!0},this._frequency,!1),this._collectionsHandler=this._renderer.scheduler.repeat(()=>{for(let e of this._managedCollections){let{context:t,collection:n,type:r}=e;t[n]=r===`hash`?en(t[n]):tn(t[n])}},this._frequency)):(this._renderer.scheduler.cancel(this._handler),this._renderer.scheduler.cancel(this._collectionsHandler),this._handler=0,this._collectionsHandler=0))}prerender({container:e}){this.now=performance.now(),e.renderGroup.gcTick=this._renderer.tick++,this._updateInstructionGCTick(e.renderGroup,e.renderGroup.gcTick)}postrender(){this._ready&&this.enabled&&(this.run(),this._ready=!1)}_updateInstructionGCTick(e,t){e.instructionSet.gcTick=t,e.gcTick=t;for(let n of e.renderGroupChildren)this._updateInstructionGCTick(n,t)}addCollection(e,t,n){this._managedCollections.push({context:e,collection:t,type:n})}addResource(e,t){e._gcLastUsed===-1?(e._gcData={index:this._managedResources.length,type:t},e._gcLastUsed=this.now,e._onTouch?.(this.now),e.once(`unload`,this.removeResource,this),this._managedResources.push(e)):(e._gcLastUsed=this.now,e._onTouch?.(this.now))}removeResource(e){let t=e._gcData;if(!t)return;let n=t.index,r=this._managedResources.length-1;if(this._running)this._managedResources[n]=null;else{if(n!==r){let e=this._managedResources[r];this._managedResources[n]=e,e._gcData.index=n}this._managedResources.length--}e._gcData=null,e._gcLastUsed=-1}addResourceHash(e,t,n,r=0){this._managedResourceHashes.push({context:e,hash:t,type:n,priority:r}),this._managedResourceHashes.sort((e,t)=>e.priority-t.priority)}run(){if(this._running)return;let e=performance.now(),t=this._managedResourceHashes,n=this._managedResources;this._running=!0;try{for(let n of t)this.runOnHash(n,e);let r=n.length;for(let t=0;t<r;t++){let r=n[t];r&&this.runOnResource(r,e)}}finally{let e=0;for(let t=0;t<n.length;t++){let r=n[t];r&&(e!==t&&(n[e]=r,r._gcData.index=e),e++)}n.length=e,this._running=!1}}updateRenderableGCTick(e,t){let n=e.renderGroup??e.parentRenderGroup,r=n?.instructionSet?.gcTick??-1;(n?.gcTick??0)===r&&(e._gcLastUsed=t,e._onTouch?.(t))}runOnResource(e,t){e._gcData.type===`renderable`&&this.updateRenderableGCTick(e,t),t-e._gcLastUsed<this.maxUnusedTime||!e.autoGarbageCollect||(e.off(`unload`,this.removeResource,this),e.unload(),this.removeResource(e))}_createHashClone(e,t){let n=Object.create(null);for(let r in e){if(r===t)break;e[r]!==null&&(n[r]=e[r])}return n}runOnHash(e,t){let{context:n,hash:r,type:i}=e,a=n[r],o=null,s=0;for(let e in a){let n=a[e];if(n===null)s++,s===1e4&&!o&&(o=this._createHashClone(a,e));else if(n._gcLastUsed===-1)n._gcLastUsed=t,n._onTouch?.(t),o&&(o[e]=n);else if(i===`renderable`&&this.updateRenderableGCTick(n,t),!(t-n._gcLastUsed<this.maxUnusedTime)&&n.autoGarbageCollect){if(i===`renderable`){let e=n,t=e.renderGroup??e.parentRenderGroup;t&&(t.structureDidChange=!0)}n.unload(),n._gcData=null,n._gcLastUsed=-1,o||(s+1===1e4?o=this._createHashClone(a,e):(a[e]=null,s++))}else o&&(o[e]=n)}o&&(n[r]=o)}destroy(){this.enabled=!1,this._managedResources.forEach(e=>{e?.off(`unload`,this.removeResource,this)}),this._managedResources.length=0,this._managedResourceHashes.length=0,this._managedCollections.length=0,this._renderer=null}};nn.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`gc`,priority:0},nn.defaultOptions={gcActive:!0,gcMaxUnusedTime:6e4,gcFrequency:3e4};var rn=nn,an=class{constructor(e){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=e}reset(){this._stackIndex=0;for(let e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(let e=0;e<this._activeBindGroups.length;e++)this._bindGroupPool.push(this._activeBindGroups[e]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(e){this.reset(),this.push(e)}bind({size:e,projectionMatrix:t,worldTransformMatrix:n,worldColor:r,offset:i}){let a=this._renderer.renderTarget.renderTarget,o=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:a,worldTransformMatrix:new w,worldColor:4294967295,offset:new v},s={projectionMatrix:t||this._renderer.renderTarget.projectionMatrix,resolution:e||a.size,worldTransformMatrix:n||o.worldTransformMatrix,worldColor:r||o.worldColor,offset:i||o.offset,bindGroup:null},c=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(c);let l=c.uniforms;l.uProjectionMatrix=s.projectionMatrix,l.uResolution=s.resolution,l.uWorldTransformMatrix.copyFrom(s.worldTransformMatrix),l.uWorldTransformMatrix.tx-=s.offset.x,l.uWorldTransformMatrix.ty-=s.offset.y,Ct(s.worldColor,l.uWorldColorAlpha,0),c.update();let u;this._renderer.renderPipes.uniformBatch?u=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(c,!1):(u=this._bindGroupPool.pop()||new ee,this._activeBindGroups.push(u),u.setResource(c,0)),s.bindGroup=u,this._currentGlobalUniformData=s}push(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===O.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get globalUniformData(){return this._currentGlobalUniformData}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new S({uProjectionMatrix:{value:new w,type:`mat3x3<f32>`},uWorldTransformMatrix:{value:new w,type:`mat3x3<f32>`},uWorldColorAlpha:{value:new Float32Array(4),type:`vec4<f32>`},uResolution:{value:[0,0],type:`vec2<f32>`}},{isStatic:!0})}destroy(){this._renderer=null,this._globalUniformDataStack.length=0,this._uniformsPool.length=0,this._activeUniforms.length=0,this._bindGroupPool.length=0,this._activeBindGroups.length=0,this._currentGlobalUniformData=null}};an.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`globalUniforms`};var on=1,sn=class{constructor(){this._tasks=[],this._offset=0}init(){le.system.add(this._update,this)}repeat(e,t,n=!0){let r=on++,i=0;return n&&(this._offset+=1e3,i=this._offset),this._tasks.push({func:e,duration:t,start:performance.now(),offset:i,last:performance.now(),repeat:!0,id:r}),r}cancel(e){for(let t=0;t<this._tasks.length;t++)if(this._tasks[t].id===e){this._tasks.splice(t,1);return}}_update(){let e=performance.now();for(let t=0;t<this._tasks.length;t++){let n=this._tasks[t];if(e-n.offset-n.last>=n.duration){let t=e-n.start;n.func(t),n.last=e}}}destroy(){le.system.remove(this._update,this),this._tasks.length=0}};sn.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`scheduler`,priority:0};var cn=!1;function ln(e){if(!cn){if(A.get().getNavigator().userAgent.toLowerCase().indexOf(`chrome`)>-1){let t=[`%c  %c  %c  %c  %c PixiJS %c v${F} (${e}) http://www.pixijs.com/

`,`background: #E72264; padding:5px 0;`,`background: #6CA2EA; padding:5px 0;`,`background: #B5D33D; padding:5px 0;`,`background: #FED23F; padding:5px 0;`,`color: #FFFFFF; background: #E72264; padding:5px 0;`,`color: #E72264; background: #FFFFFF; padding:5px 0;`];globalThis.console.log(...t)}else globalThis.console&&globalThis.console.log(`PixiJS ${F} - ${e} - http://www.pixijs.com/`);cn=!0}}var un=class{constructor(e){this._renderer=e}init(e){if(e.hello){let e=this._renderer.name;this._renderer.type===O.WEBGL&&(e+=` ${this._renderer.context.webGLVersion}`),ln(e)}}};un.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`hello`,priority:-2},un.defaultOptions={hello:!1};var dn=class e{constructor(e){this._renderer=e}init(t){t={...e.defaultOptions,...t},this.maxUnusedTime=t.renderableGCMaxUnusedTime}get enabled(){return g(`8.15.0`,`RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead.`),this._renderer.gc.enabled}set enabled(e){g(`8.15.0`,`RenderableGCSystem.enabled is deprecated, please use the GCSystem.enabled instead.`),this._renderer.gc.enabled=e}addManagedHash(e,t){g(`8.15.0`,`RenderableGCSystem.addManagedHash is deprecated, please use the GCSystem.addCollection instead.`),this._renderer.gc.addCollection(e,t,`hash`)}addManagedArray(e,t){g(`8.15.0`,`RenderableGCSystem.addManagedArray is deprecated, please use the GCSystem.addCollection instead.`),this._renderer.gc.addCollection(e,t,`array`)}addRenderable(e){g(`8.15.0`,`RenderableGCSystem.addRenderable is deprecated, please use the GCSystem instead.`),this._renderer.gc.addResource(e,`renderable`)}run(){g(`8.15.0`,`RenderableGCSystem.run is deprecated, please use the GCSystem instead.`),this._renderer.gc.run()}destroy(){this._renderer=null}};dn.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`renderableGC`,priority:0},dn.defaultOptions={renderableGCActive:!0,renderableGCMaxUnusedTime:6e4,renderableGCFrequency:3e4};var fn=dn,pn=class e{get count(){return this._renderer.tick}get checkCount(){return this._checkCount}set checkCount(e){g(`8.15.0`,`TextureGCSystem.run is deprecated, please use the GCSystem instead.`),this._checkCount=e}get maxIdle(){return this._renderer.gc.maxUnusedTime/1e3*60}set maxIdle(e){g(`8.15.0`,`TextureGCSystem.run is deprecated, please use the GCSystem instead.`),this._renderer.gc.maxUnusedTime=e/60*1e3}get checkCountMax(){return Math.floor(this._renderer.gc._frequency/1e3)}set checkCountMax(e){g(`8.15.0`,`TextureGCSystem.run is deprecated, please use the GCSystem instead.`)}get active(){return this._renderer.gc.enabled}set active(e){g(`8.15.0`,`TextureGCSystem.run is deprecated, please use the GCSystem instead.`),this._renderer.gc.enabled=e}constructor(e){this._renderer=e,this._checkCount=0}init(t){t.textureGCActive!==e.defaultOptions.textureGCActive&&(this.active=t.textureGCActive),t.textureGCMaxIdle!==e.defaultOptions.textureGCMaxIdle&&(this.maxIdle=t.textureGCMaxIdle),t.textureGCCheckCountMax!==e.defaultOptions.textureGCCheckCountMax&&(this.checkCountMax=t.textureGCCheckCountMax)}run(){g(`8.15.0`,`TextureGCSystem.run is deprecated, please use the GCSystem instead.`),this._renderer.gc.run()}destroy(){this._renderer=null}};pn.extension={type:[x.WebGLSystem,x.WebGPUSystem],name:`textureGC`},pn.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:null,textureGCMaxIdle:3600,textureGCCheckCountMax:600};var mn=pn,hn=class e extends ie{constructor(e={}){super(),this.uid=D(`renderTarget`),this.colorAttachments=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),this._managedColorTextures=!1,this._depth=!1,this._stencil=!1,this._colorTextures=null;let t=`colorAttachments`in e?e:this._normalizeOptions(e);if(this.isRoot=t.isRoot??!1,this.label=t.label,this.colorAttachments=t.colorAttachments,this.depthStencilAttachment=t.depthStencilAttachment,this.depthStencilAttachment){let e=this.depthStencilAttachment.texture.format;this._depth||=e.includes(`depth`),this._stencil||=e.includes(`stencil`)}if(this.colorAttachments.length===0&&!this.depthStencilAttachment)throw Error(`[RenderTarget] no color textures or depth textures were provided. Provide a depthStencilTexture or set depth/stencil to true when using colorTextures: 0.`);if(this.colorAttachments.length>0){let e=this.colorTexture;this.resize(e.width,e.height,e._resolution)}this.sizeSource&&this.sizeSource.on(`resize`,this.onSourceResize,this)}_normalizeOptions(t){let n={...e.defaultOptions,...t},r=[],i;if(typeof n.colorTextures==`number`){if(n.colorTextures>0){this._managedColorTextures=!0;for(let e=0;e<n.colorTextures;e++)r.push({texture:new a({width:n.width,height:n.height,resolution:n.resolution,antialias:n.antialias}),loadOp:`clear`,storeOp:`store`})}}else n.colorTextures.forEach(e=>{r.push({texture:e.source,loadOp:`clear`,storeOp:`store`})});let o=n.depthStencilTexture===!0;if(this._depth=!!(n.depth||o),this._stencil=!!(n.stencil||o),n.depthStencilTexture instanceof p||n.depthStencilTexture instanceof a){if(n.isRoot)throw Error(`[RenderTarget] cannot attach a depth-stencil texture to the screen — the canvas owns its own depth/stencil buffers. Render to a texture target instead.`);i={texture:n.depthStencilTexture.source}}else(o&&!n.isRoot||(n.stencil||n.depth)&&r.length===0)&&(i=this._createDepthStencilTexture(n.width,n.height,n.resolution));return{colorAttachments:r,depthStencilAttachment:i,isRoot:n.isRoot,label:n.label}}get size(){let e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}get width(){return this.sizeSource.width}get height(){return this.sizeSource.height}get pixelWidth(){return this.sizeSource.pixelWidth}get pixelHeight(){return this.sizeSource.pixelHeight}get resolution(){return this.sizeSource._resolution}get colorTextures(){return this._colorTextures||=this.colorAttachments.map(e=>e.texture),this._colorTextures}get depthStencilTexture(){return this.depthStencilAttachment?.texture??null}get depth(){return this._depth}get stencil(){return this._stencil}get colorTexture(){return this.colorAttachments[0]?.texture}get sizeSource(){return this.colorAttachments[0]?.texture??this.depthStencilAttachment?.texture}onSourceResize(e){this.resize(e.width,e.height,e._resolution,!0)}ensureDepthStencilTexture(){this._createDepthStencilTexture(this.sizeSource.width,this.sizeSource.height,this.sizeSource._resolution),this._depth=!0,this._stencil=!0}resize(e,t,n=this.resolution,r=!1){if(this.dirtyId++,this.colorAttachments.forEach((i,a)=>{r&&a===0||i.texture.resize(e,t,n)}),this.depthStencilAttachment){if(r&&this.colorAttachments.length===0)return;this.depthStencilAttachment.texture.resize(e,t,n)}}destroy(){(this.colorAttachments||this.depthStencilAttachment)&&(this.emit(`destroy`,this),this.sizeSource.off(`resize`,this.onSourceResize,this),this._managedColorTextures&&this.colorAttachments.forEach(e=>{e.texture.destroy()}),this.depthStencilAttachment&&(this.depthStencilAttachment.texture.destroy(),delete this.depthStencilAttachment),this.colorAttachments=null,this._colorTextures=null,this.removeAllListeners())}_createDepthStencilTexture(e,t,n){return this.depthStencilAttachment??={texture:new a({width:e,height:t,resolution:n,format:`depth24plus-stencil8`,autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1})},this.depthStencilAttachment}};hn.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};var Z=hn,Q=new Map;u.register(Q);function gn(e,t){if(!Q.has(e)){let n=new p({source:new y({resource:e,...t})}),r=()=>{Q.get(e)===n&&Q.delete(e)};n.once(`destroy`,r),n.source.once(`destroy`,r),Q.set(e,n)}return Q.get(e)}var $=class e{get autoDensity(){return this.texture.source.autoDensity}set autoDensity(e){this.texture.source.autoDensity=e}get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}constructor(e){this._renderer=e}init(t){t={...e.defaultOptions,...t},t.view&&(g(l,`ViewSystem.view has been renamed to ViewSystem.canvas`),t.canvas=t.view),this.screen=new E(0,0,t.width,t.height),this.canvas=t.canvas||A.get().createCanvas(),this.antialias=!!t.antialias;let{depth:n,...r}=t;this.texture=gn(this.canvas,r),this.renderTarget=new Z({colorTextures:[this.texture],depth:!!n,isRoot:!0}),this.texture.source.transparent=t.backgroundAlpha<1,this.texture.source.on(`resize`,this._updateScreenSize,this),this.resolution=t.resolution,this._updateScreenSize()}resize(e,t,n){this.texture.source.resize(e,t,n),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height}destroy(e=!1){(typeof e==`boolean`?e:e?.removeView)&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),this.texture.source.off(`resize`,this._updateScreenSize,this),r.removeScreen(this._renderer.uid),ce.removeScreen(this._renderer.uid),this.texture.destroy()}_updateScreenSize(){let{pixelWidth:e,pixelHeight:t}=this.texture.source,n=this._renderer.uid;r.setScreenSize(n,e,t),ce.setScreenSize(n,e,t)}};$.extension={type:[x.WebGLSystem,x.WebGPUSystem,x.CanvasSystem],name:`view`,priority:0},$.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};var _n=[Kt,an,un,$,Wt,rn,mn,$t,Jt,_e,fn,sn],vn=[Pt,wt,Nt,Mt,Dt,kt,Ot,At];function yn(e,t,n,r,i,a){let o=a?1:-1;return e.identity(),e.a=1/r*2,e.d=o*(1/i*2),e.tx=-1-t*e.a,e.ty=-o-n*e.d,e}function bn(e){if(e.colorAttachments.length===0)return!1;let t=e.colorTexture.resource;return globalThis.HTMLCanvasElement&&t instanceof HTMLCanvasElement&&document.body.contains(t)}var xn=class{constructor(e){this.rootViewPort=new E,this.viewport=new E,this.onRenderTargetChange=new fe(`onRenderTargetChange`),this.projectionMatrix=new w,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._bindState={target:null,frame:void 0,mipLevel:0,layer:0,flipY:!1},this._bindFrame=new E,this._renderer=e,e.gc.addCollection(this,`_gpuRenderTargetHash`,`hash`)}get renderSurface(){return this._bindState.target}get mipLevel(){return this._bindState.mipLevel}get layer(){return this._bindState.layer}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart(e){this._renderTargetStack.length=0,this.push(e),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=bn(this.rootRenderTarget),this.adaptor.prerender?.(this.rootRenderTarget)}postrender(){this.adaptor.postrender?.(this.rootRenderTarget)}bind(e,t=!0,n,r,i=0,a=0,o){let s;`target`in e?s=e:(g(`8.20.0`,`RenderTargetSystem.bind: positional arguments are deprecated, please use an options object instead: bind({ target, clear, clearColor, frame, mipLevel, layer, flipY })`),s={target:e,clear:t,clearColor:n,frame:r,mipLevel:i,layer:a,flipY:o});let c=s.target;t=s.clear??!0,n=s.clearColor,i=(s.mipLevel??0)|0,a=(s.layer??0)|0,o=s.flipY,r=s.frame;let l=this.getRenderTarget(c),u=this.renderTarget!==l||!!l.flipY!=!!o;this.renderTarget=l;let d=this.getGpuRenderTarget(l);(l.pixelWidth!==d.width||l.pixelHeight!==d.height)&&(this.adaptor.resizeGpuRenderTarget(l),d.width=l.pixelWidth,d.height=l.pixelHeight);let f=l.colorAttachments[0]?.texture||l.depthStencilAttachment?.texture,m=this.viewport,h=f.dimension===`3d`?Math.max(f.depth>>i,1):f.depthOrArrayLayers;if(a<0||a>=h)throw Error(`[RenderTargetSystem] layer ${a} is out of bounds (layer count=${h}).`);let _=this._bindState;_.target=c,_.frame=r?this._bindFrame.copyFrom(r):void 0,_.mipLevel=i,_.layer=a,_.flipY=o;let v=Math.max(f.pixelWidth>>i,1),y=Math.max(f.pixelHeight>>i,1);if(!r&&c instanceof p&&(r=c.frame),r){let e=f._resolution,t=1<<Math.max(i,0),n=r.x*e+.5|0,a=r.y*e+.5|0,o=r.width*e+.5|0,s=r.height*e+.5|0,c=Math.floor(n/t),l=Math.floor(a/t),u=Math.ceil(o/t),d=Math.ceil(s/t);c<0&&(u+=c,c=0),l<0&&(d+=l,l=0),c=Math.min(c,v-1),l=Math.min(l,y-1),u=Math.min(u,v-c),d=Math.min(d,y-l),u=Math.max(u,1),d=Math.max(d,1),m.x=c,m.y=l,m.width=u,m.height=d}else m.x=0,m.y=0,m.width=v,m.height=y;return l.flipY=o,yn(this.projectionMatrix,0,0,m.width/f.resolution,m.height/f.resolution,!l.isRoot!=!!l.flipY),this.adaptor.startRenderPass(l,t,n,m,i,a),u&&this.onRenderTargetChange.emit(l),l}getBindState(e){if(!this.renderTarget)throw Error(`[RenderTargetSystem] getBindState is only valid while a render surface is bound`);let t=this._bindState;return e??={},e.target=t.target,e.clear=P.NONE,e.clearColor=void 0,t.frame?e.frame?e.frame.copyFrom(t.frame):e.frame=t.frame.clone():e.frame=void 0,e.mipLevel=t.mipLevel,e.layer=t.layer,e.flipY=!!t.flipY,e}isFrontFaceInverted(e,t){if(!e){if(e=this.renderTarget,!e)return!1;t=e.flipY}return!!t!=(this._renderer.type===O.WEBGL&&!e.isRoot)}get frontFaceInverted(){return g(e,`RenderTargetSystem.frontFaceInverted is deprecated, use isFrontFaceInverted() instead`),this.isFrontFaceInverted()}clear(e,t=P.ALL,n,r=this.mipLevel,i=this.layer){t&&(e&&=this.getRenderTarget(e),this.adaptor.clear(e||this.renderTarget,t,n,this.viewport,r,i))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(e,t=P.ALL,n,r,i=0,a=0,o){let s;`target`in e?s=e:(g(`8.20.0`,`RenderTargetSystem.push: positional arguments are deprecated, please use an options object instead: push({ target, clear, clearColor, frame, mipLevel, layer, flipY })`),s={target:e,clear:t,clearColor:n,frame:r,mipLevel:i,layer:a,flipY:o});let c=this.bind(s);return this._renderTargetStack.push({target:s.target,clear:!1,clearColor:void 0,frame:s.frame?s.frame.clone():void 0,mipLevel:s.mipLevel,layer:s.layer,flipY:s.flipY}),c}pop(){this._renderTargetStack.pop();let e=this._renderTargetStack[this._renderTargetStack.length-1];if(!e)throw Error(`[RenderTargetSystem] pop: no previous binding to restore (unbalanced pop)`);return this.bind(e)}getRenderTarget(e){return e.isTexture&&(e=e.source),this._renderSurfaceToRenderTargetHash.get(e)??this._initRenderTarget(e)}copyToTexture(e,t,n,r,i){let a=this.getRenderTarget(e);n.x<0&&(r.width+=n.x,i.x-=n.x,n.x=0),n.y<0&&(r.height+=n.y,i.y-=n.y,n.y=0);let{pixelWidth:o,pixelHeight:s}=a;return r.width=Math.min(r.width,o-n.x),r.height=Math.min(r.height,s-n.y),this.adaptor.copyToTexture(a,t,n,r,i)}copyDepthTexture(e,t,n,r,i={x:0,y:0}){let a=this.getRenderTarget(e);if(!a.depthStencilAttachment){j(`[RenderTargetSystem] copyDepthTexture: the source render target has no depth attachment to copy from`);return}let o=t.source;if(!o.format.includes(`depth`)&&!o.format.includes(`stencil`)){j(`[RenderTargetSystem] copyDepthTexture: the destination texture must have a depth/stencil format (got '${o.format}')`);return}let s=n.x,c=n.y,l=i.x,u=i.y,d=r.width,f=r.height;s<0&&(d+=s,l-=s,s=0),c<0&&(f+=c,u-=c,c=0),d=Math.min(d,a.pixelWidth-s),f=Math.min(f,a.pixelHeight-c),d=Math.min(d,o.pixelWidth-l),f=Math.min(f,o.pixelHeight-u),d<=0||f<=0||this.adaptor.copyDepthTexture(a,t,{x:s,y:c},{width:d,height:f},{x:l,y:u})}ensureDepthStencil(){if(!this.renderTarget.stencil){if(this.renderTarget.depthStencilTexture){j(`[RenderTargetSystem] a stencil mask is being used, but the render target's depthStencilTexture format '${this.renderTarget.depthStencilTexture.format}' has no stencil aspect, so masking cannot work here. Use a 'depth24plus-stencil8' texture instead.`);return}this.renderTarget._depth=!0,this.renderTarget._stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport,0,this.layer)}}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((e,t)=>{e===t?e.off(`destroy`,this._onRenderTargetDestroy,this):this._releaseRenderTarget(t,e)}),this._renderSurfaceToRenderTargetHash.clear();for(let e of Object.values(this._gpuRenderTargetHash))e&&this.adaptor.destroyGpuRenderTarget(e);this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(e){let t=null;if(y.test(e)&&(e=gn(e).source),e instanceof Z)t=e,e.once(`destroy`,this._onRenderTargetDestroy,this);else if(e instanceof a){let n=e.format;t=n.includes(`depth`)||n.includes(`stencil`)?new Z({colorTextures:0,depthStencilTexture:e}):new Z({colorTextures:[e]}),e.source instanceof y&&(t.isRoot=!0),e.once(`destroy`,this._onRenderSurfaceDestroy,this)}return this._renderSurfaceToRenderTargetHash.set(e,t),t}_onRenderSurfaceDestroy(e){let t=this._renderSurfaceToRenderTargetHash.get(e);t&&this._releaseRenderTarget(e,t)}_onRenderTargetDestroy(e){this._renderSurfaceToRenderTargetHash.delete(e),this._releaseGpuRenderTarget(e)}_releaseRenderTarget(e,t){t.destroy(),this._renderSurfaceToRenderTargetHash.delete(e),e.off(`destroy`,this._onRenderSurfaceDestroy,this),this._releaseGpuRenderTarget(t)}_releaseGpuRenderTarget(e){let t=this._gpuRenderTargetHash[e.uid];t&&(this._gpuRenderTargetHash[e.uid]=null,this.adaptor.destroyGpuRenderTarget(t))}getGpuRenderTarget(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}resetState(){this.renderTarget=null,this._bindState.target=null}};export{Ce as C,he as D,ge as E,P as O,nt as S,I as T,ct as _,Nt as a,at as b,Dt as c,Ct as d,vt as f,ft as g,dt as h,Pt as i,de as k,wt as l,mt as m,vn as n,Mt as o,_t as p,_n as r,At as s,xn as t,q as u,ut as v,L as w,rt as x,it as y};