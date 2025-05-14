/* --------------------------------------
Resize Covers
by Aaron Troia (@atroia)
Modified Date: 05/14/25

Description: 
Crop full cover image spread to just the front cover.

This script is still a work in progress as I add 
trim sizes.
-------------------------------------- */

var d = app.activeDocument;
app.preferences.rulerUnits = Units.PIXELS;
d.height;


if (d.height === "2700 px" || d.height === "2775 px") {
  if (d.height === "2700 px") {
    d.resizeCanvas(1800, d.height, AnchorPosition.TOPRIGHT); // 6x9
  } else if (d.height === "2775 px") {
    d.resizeCanvas(1838, 2775, AnchorPosition.MIDDLERIGHT); // 6x9 with bleed
    d.resizeCanvas(1800, 2700, AnchorPosition.MIDDLELEFT);
  }
} else if (d.height === "2100 px" || d.height === "2175 px") {
  if (d.height === "2100 px") {
    if (confirm("Is this 4.75 (yes) or 4.25 (no)?")) {
      d.resizeCanvas(1425, d.height, AnchorPosition.TOPRIGHT); // 4.75x7
    } else {
      d.resizeCanvas(1275, d.height, AnchorPosition.TOPRIGHT); // 4.25x7
    }
  } else if (d.height === "2175 px") {
    if (confirm("Is this 4.75 (yes) or 4.25 (no) with bleed?")) {
      d.resizeCanvas(1462.5, 2175, AnchorPosition.MIDDLERIGHT); // 4.75x7 with bleed
      d.resizeCanvas(1425, 2100, AnchorPosition.MIDDLELEFT);
    } else {
      d.resizeCanvas(1312.5, 2175, AnchorPosition.MIDDLERIGHT); // 4.25x7 with bleed
      d.resizeCanvas(1275, 2100, AnchorPosition.MIDDLELEFT);
    }
  }
} else if (
  d.height === "3187.5 px" ||
  d.height === "3188 px" ||
  d.height === "3225 px"
) {
  if (d.height === "3187.5 px" || d.height === "3188 px") {
    d.resizeCanvas(2437.5, d.height, AnchorPosition.TOPRIGHT); // 10.625 x 8.125
  } else if (d.height === "3225 px") {
    d.resizeCanvas(2475, 3225, AnchorPosition.MIDDLERIGHT); // 10.625 x 8.125 with bleed
    d.resizeCanvas(2437.5, 3188, AnchorPosition.MIDDLELEFT);
  }
}
