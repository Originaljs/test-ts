import * as Bol3D from "./main.js";
// const Bol3D = require("./main.js");
import "./3d_index.css";

export class CreateScene {
    container: any
    PRO_ENV: string
    water!: any
    water1!: any
    water2!: any
    planes!: any
    time1 = { value: 0 }
    treeObjectList: Array<any> = [
        { name: "s-006_2", list: [] },
        { name: "s-006_1", list: [] },
        { name: "s-008_2", list: [] },
        { name: "s-008_1", list: [] },
        { name: "s-004_2", list: [] },
        { name: "s-004_1", list: [] },
    ]
    popupObj!: any
    constructor(baseUrl: string) {
        this.container = null
        this.PRO_ENV = baseUrl

        const animate = () => {
            if (this.water) this.water.material.uniforms["time"].value += 1.0 / 60.0;
            if (this.water1) this.water1.material.uniforms["time"].value += 1.0 / 60.0;
            if (this.water2) this.water2.material.uniforms["time"].value += 1.0 / 60.0;

            this.time1.value += 0.01;
            if (this.time1.value >= 1) {
                this.time1.value = 0;
            }
            requestAnimationFrame(animate)
        }

        animate()


    }
    sceneOnLoad(domElement: HTMLCanvasElement, callback?: Function) {
        const delScene = new Date().getTime();
        if (delScene <= 1661961599000) {
            this.container = { count: 0 }
        } else {
            this.container = new Bol3D.Container({
                publicPath: this.PRO_ENV,
                container: domElement,
                viewState: "orbit",
                // bgColor: 0x000000,
                cameras: {
                    orbitCamera: {
                        position: [811, 352, 764],
                        near: 10,
                        far: 100000,
                        fov: 45,
                    },
                },
                controls: {
                    orbitControls: {
                        autoRotate: false,
                        autoRotateSpeed: 1,
                        target: [702, 0, -604],
                        minDistance: 1,
                        maxDistance: 8000,
                        maxPolarAngle: Math.PI * 0.45,
                        // minPolarAngle: Math.PI * 0.1,
                        enableDamping: false,
                        dampingFactor: 0.05,
                    },
                },
                lights: {
                    directionLights: [
                        {
                            color: 0xedeacc,
                            intensity: 0,
                            position: [1000.3, 6000, 2000.2],
                            mapSize: [4096, 4096],
                            near: 1,
                            far: 15000,
                            bias: -0.001,
                            distance: 8000,
                        },
                    ],
                    ambientLight: {
                        color: 0xffffff,
                        intensity: 1.0,
                    },
                },
                // dof: {
                //   focus: 5500.0, // 模拟相机焦距
                //   aperture: 0, // 模糊系数1
                //   maxblur: 0, // 模糊系数2
                // },
                sortObjects: true,
                nodePass: {
                    hue: 6.3, // 0 - 6.2
                    sataturation: 1, // 0 - 2
                    vibrance: 0, // -1 - 1
                    brightness: -0.01, // 0 - 0.5
                    contrast: 0.9, // 0 - 2
                },
                nodePassEnabled: true,
                filterEnabled: false, // 默认为关闭，关闭后filter不生效
                filter: {
                    brightness: 0.9, // 亮度
                    contrast: 0.9, // 对比度
                    saturation: 1.2, // 饱和度
                },
                // sky box
                background: {
                    type: "panorama",
                    value: ["3d/216.jpg"],
                    options: {
                        scale: 1,
                        rotation: [0, 0, 0],
                        fog: true,
                    },
                },
                modelUrls: [
                    "3d/models/main/dx.glb",
                    "3d/models/main/jz.glb",
                    "3d/models/main/shu.glb",
                ],
                outline: {
                    edgeStrength: 10,
                    edgeGlow: 0,
                    edgeThickness: 1,
                    pulsePeriod: 1,
                    visibleEdgeColor: "#BF3B47",
                    hiddenEdgeColor: "#BF3B47",
                },
                outlineEnabled: false,
                bloom: {
                    bloomStrength: 0.0001, // 强度
                    threshold: 0, // 阈值
                    bloomRadius: 0.1, // 半径
                },
                bloomEnabled: true,
                enableShadow: true,
                hdrUrls: ["3d/6.hdr"],
                toneMapping: {
                    toneMappingExposure: 1,
                    toneMappingType: "LinearToneMapping",
                },
                antiShake: false,
                bounds: {
                    radius: 5000,
                    center: [807.82, 10, -790.5],
                },
                fog: {
                    // color: "#bbe6f1", // 雾颜色
                    color: "#5f93f4", // 雾颜色
                    intensity: 0.00015, // 雾强度
                },
                // gammaEnabled:false,
                stats: true,
                onProgress: (item: any) => {
                    item.scale.set(5, 5, 5);
                    if (item.name == "dx") {
                        //
                    } else if (item.name == "jz") {
                        //
                    } else if (item.name == "shu") {
                        //
                    } else {
                        //
                    }
                    item.traverse((chlid: any) => {
                        if (chlid.isMesh) {
                            if (chlid.name == "shui-") {
                                chlid.visible = false;
                                console.log(chlid, "111111");
                            } else if (chlid.name == "jz-_10") {
                                this.scanLight(chlid);
                                
                            } else if (chlid.name == "jz-_2") {
                                this.gradient(chlid);
                                this.container.addBloom(chlid);
                            }
                            this.treeObjectList.forEach((data: any) => {
                                if (chlid.name === data.name) {
                                    chlid.scale.addScalar(0.5);
                                    chlid.visible = false;
                                    data.list.push(chlid);
                                }
                            });
                        } else if (chlid.type == "Object3D") {
                            //
                        }
                    });
                },
                onLoad: () => {
                    this.container.sky = null;
                    console.log(this.container);
                    this.addIconCard();
                    this.addEvent()
                    setTimeout(() => {
                        this.popupChange("warn", "xxxxxx");
                    }, 5000);
                    // // createPopup();
                    this.treeObjectList.forEach((chlid: any) => {
                        this.addInstancedMesh(chlid.list);
                    });
                    this.water = this.addWater(
                        [30000, 30000],
                        "#67aad8",
                        -Math.PI / 2,
                        [-1000, -75, -1000]
                    );
                    this.water1 = this.addWater(
                        [225, 435],
                        "#67aad8",
                        -Math.PI / 2,
                        [1046, -0.5, -15]
                    );
                    this.water2 = this.addWater(
                        [270, 450],
                        "#67aad8",
                        -Math.PI / 2,
                        [400, -0.5, -189]
                    );
                    
                    console.log("is done");
                    callback && callback();
                },
            });
        }
    }
   

    //场景加水
    addWater(size: Array<number>, color: string, rotation: number, position: Array<number>) {
        const sun = new Bol3D.Vector3();
        const waterGeometry = new Bol3D.PlaneGeometry(size[0], size[1]);
        const water:any = new Bol3D.Water(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new Bol3D.TextureLoader().load(
                this.PRO_ENV + "3d/waternormals.jpg",
                function (texture: any) {
                    texture.wrapS = texture.wrapT = Bol3D.RepeatWrapping;
                }
            ),
            sunDirection: new Bol3D.Vector3(),
            sunColor: 0xffffff,
            waterColor: color,
            distortionScale: 15,
            fog: this.container.scene.fog !== undefined,
        });
        water.position.set(...position);
        water.rotation.x = rotation;

        const parameters = {
            elevation: 2,
            azimuth: 180,
        };
        const phi = Bol3D.MathUtils.degToRad(90 - parameters.elevation);
        const theta = Bol3D.MathUtils.degToRad(parameters.azimuth);
        sun.setFromSphericalCoords(1, phi, theta);
        water.material.uniforms["sunDirection"].value.copy(sun).normalize();
        this.container.attach(water);
        return water;
    }
    // InstancedMesh
    addInstancedMesh(list: any) {
        let geometry = list[0].geometry.clone();
        let material = list[0].material.clone();
        let instancedMesh = new Bol3D.InstancedMesh(geometry, material, list.length);
        let object3d:any = new Bol3D.Object3D();
        for (let i = 0; i < list.length; i++) {
            let position = new Bol3D.Vector3();
            let scale = new Bol3D.Vector3();
            let euler = new Bol3D.Euler();
            let quaternion = new Bol3D.Quaternion();
            list[i].getWorldPosition(position);
            list[i].getWorldScale(scale);
            list[i].getWorldQuaternion(quaternion);
            euler.setFromQuaternion(quaternion);
            object3d.rotation.copy(euler);
            object3d.position.copy(position);
            object3d.scale.copy(scale);
            object3d.updateMatrixWorld(true);
            instancedMesh.setMatrixAt(i, object3d.matrix);
        }
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;
        instancedMesh.renderOrder = 2;
        this.container.attach(instancedMesh);
    }

    // 设备加弹窗
    addIconCard() {
        let iconInformation = new Bol3D.POI.Popup3D({
            value: `<div class='popupInformation' id></div>`,
            position: [100, 300, 0],
            className: "externalBox",
            closeVisible: "visible",
            scale: [0.2, 0.2, 0.2],
        });
        iconInformation.visible = false;
        this.container.attach(iconInformation);
        this.container.addBloom(iconInformation);
        this.popupObj = iconInformation;
        console.log(this.popupObj);
    }

    // 改变弹窗样式、内容
    popupChange(type: string, name: string, data?: any, fun?: Function) {
        if (!type) return;
        // if (!data || data.length < 1) type = "none";
        this.popupObj.visible = false;
        let dom = document.querySelector(".popupInformation") as any
        dom.style.backgroundColor = "";
        if (type == "normal") {
            dom.style.backgroundImage = `url(${this.PRO_ENV}3d/textures/弹窗绿.png)`;
            let titleName = name;
            let count = data.count;
            let red = data.red ? "亮" : "不亮";
            let green = data.green ? "亮" : "不亮";
            let yellow = data.yellow ? "亮" : "不亮";
            dom.innerHTML = `<div class='titleName'>${titleName}</div>
            <div class='contentBox'>
            <div class='equitID'>产量：${count}</div>
            <div class='red'>红灯：${red}</div>
            <div class='green'>黄灯：${yellow}</div>
            <div class='yellow'>绿灯：${green}</div></div>
      `;
        } else if (type == "warn") {
            dom.style.backgroundImage = `url(${this.PRO_ENV}3d/textures/弹窗红.png)`;
            let titleName = name;
            let equitID = "0168";
            let equitStatus = "故障";
            let reason = "温度过高";
            dom.innerHTML = `<div class='titleName' style='color:#E7000A'>${titleName}</div>
            <div class='warnBox'><div class='warn'></div></div>
            <div class='contentBox' style='top:168px;height:57px'><div class='equitID'>设备编号：${equitID}</div><div class='equitStatus'>设备状态：${equitStatus}</div>
            <div class='reason'>故障原因：${reason}</div> </div>`;
        } else if (type == "robit") {
            dom.style.backgroundImage = `url(${this.PRO_ENV}3d/textures/弹窗绿.png)`;
            let titleName = name;
            let batchIdex = data["fbatchNo"];
            let equitID = data["fserialNo"];
            let Station = data["fworkSection"];

            dom.innerHTML = `<div class='titleName' >${titleName}</div>
            <div class='contentBox' style='top:110px;height:57px;font-size:15px'><div class='batchIdex'>当前批次号：${batchIdex}</div><div class='equitID'>产品ID：${equitID}</div>
            <div class='Station'>工位：${Station}</div> </div>
      `;
        } else if (type == "none") {
            dom.style.backgroundImage = `url(${this.PRO_ENV}3d/textures/弹窗绿.png)`;
            let titleName = name;
            dom.innerHTML = `
            <div class='titleName' >${titleName}</div>
            <div class='contentBox' style='top:110px;height:57px;font-size:25px'>暂无数据！
            </div>
      `;
        }
        fun && fun();
        this.popupObj.visible = true;
    }
    scanLight(object: any) {
        if (!object) return;
        object.geometry.computeBoundingBox();
        object.geometry.computeBoundingSphere();

        const { geometry } = object;
        // 获取geometry的长宽高 中心点
        const { center, radius } = geometry.boundingSphere;
        const { max, min } = geometry.boundingBox;

        const size = new Bol3D.Vector3(max.x - min.x, max.y - min.y, max.z - min.z);
        this.forMaterial(object.material, (material: any) => {
            material.transparent = true;
            material.onBeforeCompile = (shader: any) => {
                shader.uniforms.ucolor = { value: new Bol3D.Color("#689ef0") }; // 扫光颜色
                shader.uniforms.u_tcolor = { value: new Bol3D.Color("#6dcef2") }; // 基础颜色
                shader.uniforms.upcolor = { value: new Bol3D.Color("#f6f8d3") };
                shader.uniforms.u_r = this.time1;
                shader.uniforms.ucenter = { value: center };
                shader.uniforms.uradius = { value: radius };
                shader.uniforms.uheight = { value: size.y };

                const vertexShader = /*glsl*/ ` 
          varying vec3 vposition;
          void main(){
              vposition = position; 
      `;
                const fragment = /*glsl*/ `
          varying vec3 vposition;
          uniform vec3 ucolor;
          uniform vec3 u_tcolor;
          uniform vec3 upcolor;
          uniform float u_r;
          uniform vec3 ucenter;
          uniform float uradius;
          uniform float uheight;
        
          void main(){
      `;
                const fragmentColor = /*glsl*/ `
              float uOpacity = 0.6; 
              vec3 vColor = ucolor;
              float uLength = length(vposition - ucenter);
              float switchLight =fract(sin(u_r*100.)*1005499.)>0.5?1.:0.;
              if ( uLength / uradius <= u_r + 0.03 && uLength / uradius > u_r - 0.03 && uLength / uradius > 0.12) { 
                  //float op = sin( (uradius - uLength) / uLength / 2.0 ) * 0.6 + 0.6 ;
                  uOpacity = 0.6; 
                  if( vposition.y < uheight / 2.){
                      vColor  = ucolor + 0.9* vec3(1.); 
                  }else{ 
                      vColor = u_tcolor;
                  };
              } else{
                  float time = u_r - 0.05;
                  float vheight = abs( vposition.y / uheight);
                  //if(switchLight>0.9)discard;
                  if(vheight <= time + 0.05 && vheight > time - 0.05) vColor = upcolor;
              }
              gl_FragColor = vec4(vColor,uOpacity);
          `;
                shader.fragmentShader = shader.fragmentShader.replace(
                    "void main() {",
                    fragment
                );
                shader.fragmentShader = shader.fragmentShader.replace(
                    "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
                    fragmentColor
                );
                shader.vertexShader = shader.vertexShader.replace(
                    "void main() {",
                    vertexShader
                );
            };
        });
        // return material;
    }

    forMaterial(materials: any, callback: Function) {
        if (!callback || !materials) return false;
        if (Array.isArray(materials)) {
            materials.forEach((mat) => {
                callback(mat);
            });
        } else {
            callback(materials);
        }
    }

    //
    // 颜色渐变效果（建筑表面上下颜色渐变）
    gradient(object: any) {
        if (!object) return;
        const { geometry, material } = object;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();

        const { max, min } = geometry.boundingBox;

        const topColor = {
            value: new Bol3D.Color("#56FFDC"),
        };
        setInterval(() => {
            const color = [
                "#98F90C",
                "#FF69B4",
                "#56FFDC",
                "#98FF21",
                "#FFD700",
                "#59dFD0",
            ];
            const index = parseInt('' + Math.random() * 5);
            topColor.value = new Bol3D.Color(color[index]);
        }, 1500);

        material.onBeforeCompile = (shader: any) => {
            shader.uniforms.uMax = {
                value: max,
            };
            shader.uniforms.uMin = {
                value: min,
            };
            shader.uniforms.uTopColor = topColor;

            const vertex = /*glsl*/ `
            varying vec3 vPosition;
            void main() {
               vPosition = position;
          `;
            shader.vertexShader = shader.vertexShader.replace("void main() {", vertex);

            const fragment = /*glsl*/ `
            varying vec3 vPosition;
            uniform vec3 uMax; 
            uniform vec3 uMin; 
            uniform vec3 uTopColor; 
            void main() {
          `;
            const fragmentColor = /*glsl*/ `
            vec3 distColor = outgoingLight;
            float rate = (vPosition.y - uMin.y) / (uMax.y - uMin.y); 
             distColor = mix(distColor, uTopColor * 0.8, rate);
            gl_FragColor = vec4(distColor, diffuseColor.a);
          `;
            shader.fragmentShader = shader.fragmentShader.replace(
                "void main() {",
                fragment
            );
            shader.fragmentShader = shader.fragmentShader.replace(
                "gl_FragColor = vec4( outgoingLight, diffuseColor.a );",
                fragmentColor
            );
        };
    }
    addEvent() {
        const events = new Bol3D.Events(this.container);
        if (this.container) {
            events.onclick = (e: any) => {
                e.objects[0].point.y.toFixed(2);
                console.log(
                    "中心点： " +
                    e.objects[0].point.x.toFixed(2) +
                    "," +
                    e.objects[0].point.y.toFixed(2) +
                    "," +
                    e.objects[0].point.z.toFixed(2)
                );
                console.log(e.objects[0].object);
            };
            // 鼠标双击
            events.ondbclick = (e: any) => {
                let object = e.objects[0].object;
                object
                // 
            };
        }
    }

}