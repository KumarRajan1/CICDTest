---
 
 
hide_title: false
hide_table_of_contents: false
sidebar_label: mGIS Widgets
description: How do I find you when I cannot solve this problem
keywords:
  - Markers
  - Polylines
  - Polygons
image: https://about.mappls.com/images/mappls-og.png
slug: /mgis-widgets
title: mGIS Widgets
sidebar_position:  2
---
 
 
## Introduction ##

mGIS Widget wrapper includes many out-of-the-box widgets.These widgets provide standard functions to easily create GIS web portals. 

This wrapper has all of the parameters that allow configuration and customization.

These widgets are categorized as integrated In-panel widgets which can be added to your app.

## List of Available mGIS Widgets #
1.Map View- 2D and 3D  
2.Workview  
3.Basemap Option  
4.Basic Map Tools  

## Demo  


![mGIS-widget](https://user-images.githubusercontent.com/103164131/165482651-8440ab8a-fccb-454d-9be7-c4b5ffa06d9b.gif)




**How to use mgis widget?**

* Add mgis-widget script into html page
```html
  <script src="./widgets.js"></script>
```
* Declare widget container where widget to be initialized
```javascript
  <div id="widgetContainer" style="height: 600px; width: 800px;"></div>
```
* Declare widget options
```javascript
// Widget options
  var widgetOptions = {
    "widgetName": "map-widget", //Name Of The Widget
    "widgetKey": "", // Access Token as widget key
    "widgetOptions":{ // Widget Options
      "mapViewMode": "2d", // Default view mode map 2d or 3d
      "defaultBaseMap": "mmi-raster", // Set Default Base Map
      "defaultView": { // Set Default View Of The Map
        "center": [
          28.7041,
          77.1025
        ],
        "zoom": 12
      },
      "mapControls": true, // Show/Hide map controls
      "workViewName": "styleTest", // Load default workview
    }
  }
```
* Create Instance of mgis-widget
```javascript
// Create widget
  var mgisWidget = new MGIS.Widget('widgetContainer',widgetOptions);
```
* Initialize mgis-widget
```javascript
  // Initialize widget
  mgisWidget.init();
```
* Update widget properties
```javascript
  //Change View Mode
  mgisWidget.setWidgetProperties({
    "mapViewMode": viewMode
  });

  //Show Map Controls
  mgisWidget.setWidgetProperties({
    "mapControls": true
```
* Available Otions

  | Option        | Type | Default Value | Description |
  | ------------- | ------------- | ------------- |------------- |
  | widgetName    | String |  | Name of the widget |
  | widgetKey     | String |  | Use Access Token as widget key |
  | widgetOptions | Object |[widgetOptions](#widgetoptions)  | Widget options |

  * widgetOptions

  | **Option**     | **Type** | **Default Value** | **Description**                                 |
  |----------------|----------|-------------------|-------------------------------------------------|
  | mapViewMode    | String   | 2d                | 2d View mode of the map                         |
  |                |          | 3d                | 3d View mode of the map                         |
  | defaultBaseMap | String   | mmi-raster        | MMI Raster                                      |
  |                |          | mmi-vector        | MMI Vector                                      |
  |                |          | hr-imagery        | HR Imagery                                      |
  |                |          | hr-imagery-hybrid | HR Imagery Hybrid                               |
  |                |          | bhuvan-satellite  | Bhuvan Satellite                                |
  |                |          | bhuvan-hybrid     | Bhuvan Hybrid                                   |
  |                |          | no-basemap        | No Basemap                                      |
  |                |          | BSMP1             | OpenStreetMap                                   |
  |                |          | BSMP2H            | Google Hybrid                                   |
  |                |          | BSMP3RD           | Google Road                                     |
  |                |          | BSMP4ST           | Satellite                                       |
  |                |          | BSMP5             | Here Map                                        |
  | defaultView    | Object   |                   | Set the default view of the map                 |
  | mapControls    | Boolean  |  true             | Show the map controls                           |
  |                |          |  false            | Hide the map controls                           |
  | workViewName   | String   |                   | Set the workview name to load the workview data |

  * defaultView

  | Option | Type   | Default Value | Description                           |
  |--------|--------|---------------|---------------------------------------|
  | center | Array  |               | Set the center of the map. [lat,long] |
  | zoom   | Number |               | Set the zoom level of the map         |
  
  

 


 