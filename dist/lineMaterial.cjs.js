'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Cesium = require('cesium');

'use strict';
function LineFlickerMaterial (options) {
  this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color;
    this.speed = options.speed;
}

Object.defineProperties(LineFlickerMaterial.prototype, {
  isConstant: {
    get: function() {
      return false;
    },
  },
  definitionChanged: {
    get: function() {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
})

LineFlickerMaterial.prototype.getType = function(time) {
  return Cesium.Material.LineFlickerMaterialType;
};
LineFlickerMaterial.prototype.getValue = function(time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
  result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
  return result
}
LineFlickerMaterial.prototype.equals = function(other) {
  return (this === other ||
    (other instanceof LineFlickerMaterial &&
      Cesium.Property.equals(this._color, other._color) &&
      Cesium.Property.equals(this._speed, other._speed))
  )
};


// Cesium.Material.LineFlickerMaterial = LineFlickerMaterial;
Cesium.Material.LineFlickerMaterial = 'LineFlickerMaterial';
Cesium.Material.LineFlickerMaterialType = 'LineFlickerMaterialType';
Cesium.Material.LineFlickerMaterialSource =
  `
uniform vec4 color;
uniform float speed;
czm_material czm_getMaterial(czm_materialInput materialInput){
czm_material material = czm_getDefaultMaterial(materialInput);
float time = fract( czm_frameNumber  *  speed / 1000.0);
vec2 st = materialInput.st;
float scalar = smoothstep(0.0,1.0,time);
material.diffuse = color.rgb * scalar;
material.alpha = color.a * scalar ;
return material;
}
`

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlickerMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlickerMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 5.0,
    },
    source: Cesium.Material.LineFlickerMaterialSource
  },
  translucent: function(material) {
    return true;
  }
})

// 穿梭光路材质
function Spriteline1Material (options) {
  this._definitionChanged = new Cesium.Event();
  this.duration = options.duration;
  this.image = options.image;
  this._time = performance.now();
}

Object.defineProperties(Spriteline1Material.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor("color"),
  duration: Cesium.createPropertyDescriptor("duration"),
});
Spriteline1Material.prototype.getType = function (time) {
  return "Spriteline1";
};
Spriteline1Material.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.image = this.image;
  result.time =
    ((performance.now() - this._time) % this.duration) / this.duration;
  return result;
};
Spriteline1Material.prototype.equals = function (e) {
  return (
    this === e ||
    (e instanceof Spriteline1Material && this.duration === e.duration)
  );
};
// Cesium.Spriteline1Material = Spriteline1Material
Cesium.Material.Spriteline1Type = "Spriteline1";
Cesium.Material.Spriteline1Source = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st;
vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
material.alpha = colorImage.a;
material.diffuse = colorImage.rgb * 1.5 ;
return material;
}
`;
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
  fabric: {
    type: Cesium.Material.Spriteline1Type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: "",
      transparent: true,
      time: 20,
    },
    source: Cesium.Material.Spriteline1Source,
  },
  translucent: function (material) {
    return true;
  },
});

function GradientHilightMaterial (options) {
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._speed = undefined;
  this._percent = undefined;
  this._gradient = undefined;
  this.color = options.color;
  this.speed = options.speed;
  this.percent = options.percent;
  this.gradient = options.gradient;
}

Object.defineProperties(GradientHilightMaterial.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  percent: Cesium.createPropertyDescriptor('percent'),
  gradient: Cesium.createPropertyDescriptor('gradient'),
});
GradientHilightMaterial.prototype.getType = function (time) {
  return Cesium.Material.LineFlowMaterialType;
};
GradientHilightMaterial.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
  result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
  result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent);
  result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient);
  return result
};
GradientHilightMaterial.prototype.equals = function (other) {
  return (this === other ||
    (other instanceof GradientHilightMaterial &&
      Cesium.Property.equals(this._color, other._color) &&
      Cesium.Property.equals(this._speed, other._speed) &&
      Cesium.Property.equals(this._percent, other._percent) &&
      Cesium.Property.equals(this._gradient, other._gradient))
  )
}

// Cesium.GradientHilightMaterial = GradientHilightMaterial;
Cesium.Material.GradientHilightMaterial = 'GradientHilightMaterial';
Cesium.Material.LineFlowMaterialType = 'LineFlowMaterialType';
Cesium.Material.LineFlowMaterialSource =
  `
    uniform vec4 color;
    uniform float speed;
    uniform float percent;
    uniform float gradient;
    
    czm_material czm_getMaterial(czm_materialInput materialInput){
      czm_material material = czm_getDefaultMaterial(materialInput);
      vec2 st = materialInput.st;
      float t =fract(czm_frameNumber * speed / 1000.0);
      t *= (1.0 + percent);
      float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
      alpha += gradient;
      material.diffuse = color.rgb;
      material.alpha = alpha;
      return material;
    }
    `

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlowMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 100.0,
      percent: 10.1,
      gradient: 0.01
    },
    source: Cesium.Material.LineFlowMaterialSource
  },
  translucent: function(material) {
    return true;
  }
})
// 导出
exports.LineFlickerMaterial = LineFlickerMaterial;
exports.Spriteline1Material = Spriteline1Material;
exports.GradientHilightMaterial = GradientHilightMaterial;

Object.defineProperty(exports, '__esModule', { value: true });
