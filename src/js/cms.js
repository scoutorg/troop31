import React from "react";
import CMS from "netlify-cms";
import Assets from "./assets.js";

import PostPreview from "./cms-preview-templates/post";
import LawsPreview from "./cms-preview-templates/laws";
import ProductsPreview from "./cms-preview-templates/products";


// Example of creating a custom color widget
class ColorControl extends React.Component {
  render() {
    return <input
        style={{height: "80px"}}
        type="color"
        value={this.props.value}
        onInput={(e) => this.props.onChange(e.target.value)}
    />;
  }
}

CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("laws", LawsPreview);
CMS.registerPreviewTemplate("products", ProductsPreview);
CMS.registerPreviewStyle(Assets.assetPath("/css/main.css"));
CMS.registerWidget("color", ColorControl);
