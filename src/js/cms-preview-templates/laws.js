import React from "react";
import Assets from "../assets";

export default class LawsPreview extends React.Component {
  render() {
    const {entry, getAsset} = this.props;
    let image = getAsset(entry.getIn(["data", "image"]));

    // Bit of a nasty hack to make relative paths work as expected as a background image here
    if (image && !image.fileObj) {
      image = window.parent.location.protocol + "//" + window.parent.location.host + Assets.assetPath(image);
    }

    return <div>
      <div className="pv5 pv6-l ph3 bg-center cover" style={{
        backgroundImage: image && `url(${image})`
      }}>
        <div className="mw7 center ph3">
          <div className="db mb3">
            <div className="mw7 relative bg-fix-primary mb3">
              <h1 className="f2 f1-l b di lh-title mb3 white mw6 bg-primary">
                { entry.getIn(["data", "title"]) }
              </h1>
            </div>
            <div className="mw7 relative bg-fix-primary">
              <p className="b f4 di lh-title mb3 white mw6 bg-primary">
                { entry.getIn(["data", "description"]) }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pb4">
        {(entry.getIn(["data", "laws"]) || []).map((law, index) => <div className="center mb3 ph3" key={index}>
            <blockquote className="bg-grey-1 primary pa3 mb3 br1 b mw6 center">
                <p className="f4 mb0">“{law.get("name")}”</p>
                <cite className="tr db grey-3">{law.get("text")}</cite>
            </blockquote>
        </div>)}
      </div>
    </div>;
  }
}
