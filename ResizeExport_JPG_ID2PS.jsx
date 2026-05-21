/* --------------------------------------
InDesign to Photoshop JPG Export/Resize
by Aaron Troia (@atroia)
Modified Date:8/13/25

Description: 
Export a JPG from InDesign, open in Photoshop and crop 
and resize. Saves both high and low resolution JPGs.
-------------------------------------- */

// ===========================
// InDesign + Photoshop BridgeTalk Combined Script
// ===========================

if (app.name === "Adobe InDesign") {
    runInDesignPart();
} else if (app.name === "Adobe Photoshop") {
    runPhotoshopPart();
}

// ---------------------------
// InDesign Part
// ---------------------------
function runInDesignPart() {
    var d = app.activeDocument;
    var pageCount = d.pages.length;

    prefs();
    main();

    function main() {
        if (app.documents.length == 0) {
            alert("No documents are open.");
        } else {
            exportJPG();
        }
    }

    function prefs() {
        app.jpegExportPreferences.properties = {
            jpegRenderingStyle: JPEGOptionsFormat.BASELINE_ENCODING,
            jpegExportRange: ExportRangeOrAllPages.EXPORT_RANGE,
            jpegQuality: JPEGOptionsQuality.MAXIMUM,
            jpegColorSpace: JpegColorSpaceEnum.RGB,
            simulateOverprint: false,
            useDocumentBleeds: false,
            embedColorProfile: true,
            exportResolution: 300,
            antiAlias: true
        };
    }

    function exportJPG() {
        if ((pageCount > 6 && pageCount <= 64) || pageCount == 1 || pageCount == 48) {
            app.jpegExportPreferences.pageString = "1";
        } else if (pageCount == 2 || pageCount == 3 || pageCount == 5) {
            app.jpegExportPreferences.pageString = String(pageCount);
        }

        var thePath;
        if (d.saved) {
            thePath = String(d.fullName).replace(/\..+$/, "") + ".jpg";
        } else {
            thePath = String(new File());
        }

        thePath = thePath.replace(/\.jpg$/, "");
        var name1 = thePath + ".jpg";

        try {
            if (app.activeDocument.layers.item("Bookline").isValid) {
                app.activeDocument.layers.item("Bookline").visible = false;
            }
            d.exportFile(ExportFormat.JPG, new File(name1), false);
            alert("Cover JPG Exported");

            // Send to Photoshop via BridgeTalk
            sendToPhotoshop(name1);

        } catch (errExport) {
            alert(errExport.line + ": " + errExport);
        }
    }

    function sendToPhotoshop(jpgPath) {
        var bt = new BridgeTalk();
        bt.target = "photoshop";
        var psScript = "(" + runPhotoshopPart.toString() + ")('" + jpgPath + "');";
        bt.body = psScript;
        bt.send();
    }
}

// ---------------------------
// Photoshop Part
// ---------------------------
function runPhotoshopPart(jpgPath) {
    var d;

    if (jpgPath && File(jpgPath).exists) {
        app.open(new File(jpgPath));
    }
    d = app.activeDocument;

    app.preferences.rulerUnits = Units.PIXELS;

    var h = d.height.as("px");


    function saveLarge(h) {
        if (h === 2700 || h === 2775) {
            if (h === 2700) {
                // resizeCanvas (UnitValue width, UnitValue height, AnchorPosition anchor)
                d.resizeCanvas(1800, h, AnchorPosition.TOPRIGHT);
            } else {
                d.resizeCanvas(1838, 2775, AnchorPosition.MIDDLERIGHT);
                d.resizeCanvas(1800, 2700, AnchorPosition.MIDDLELEFT);
            }
        } else if (h === 2100 || h === 2175) {
            if (h === 2100) {
                if (confirm("Is this 4.25 (no) or 4.75 (yes)?")) {
                    d.resizeCanvas(1425, h, AnchorPosition.TOPRIGHT);
                } else {
                    d.resizeCanvas(1275, h, AnchorPosition.TOPRIGHT);
                }
            } else {
                if (confirm("Is this 4.25 (no) or 4.75 (yes) with bleed?")) {
                    d.resizeCanvas(1462.5, 2175, AnchorPosition.MIDDLERIGHT);
                    d.resizeCanvas(1425, 2100, AnchorPosition.MIDDLELEFT);
                } else {
                    d.resizeCanvas(1312.5, 2175, AnchorPosition.MIDDLERIGHT);
                    d.resizeCanvas(1275, 2100, AnchorPosition.MIDDLELEFT);
                }
            }
        } else if (h === 3187.5 || h === 3188 || h === 3225) {
            if (h === 3187.5 || h === 3188) {
                d.resizeCanvas(2437.5, h, AnchorPosition.TOPRIGHT);
            } else {
                d.resizeCanvas(2475, 3225, AnchorPosition.MIDDLERIGHT);
                d.resizeCanvas(2437.5, 3188, AnchorPosition.MIDDLELEFT);
            }
        }

        // Auto save and close
        var saveOpts = new JPEGSaveOptions();
        saveOpts.quality = 12; // Max quality
        d.saveAs(new File(jpgPath), saveOpts, true);
    }

    // resize Image for ebooks
    function saveSmall(h) {
        // resizeImage (UnitValue width, UnitValue height, Number resolution, ResampleMethod resampleMethod, int amount)
        d.resizeImage(undefined,1400,300,ResampleMethod.PRESERVEDETAILS);

        // Auto save and close
        var saveOpts = new JPEGSaveOptions();
        saveOpts.quality = 8; // Max quality
        d.saveAs(new File(jpgPath + "_ebook"), saveOpts, true);
    }

    saveLarge(h);
    saveSmall(h);

    d.close(SaveOptions.DONOTSAVECHANGES);
}


// This is an InDesign script that exports a JPG that then opens in Photoshop, is cropped, and then resized. It saves both a high resolution and a low resolution files at the same time.

// This primarily works with trade books with a trim size of 6x9. Other trim sizes will be added later.
