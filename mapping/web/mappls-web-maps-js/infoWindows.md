---
 
 
hide_title: false
hide_table_of_contents: false
sidebar_label: Info Windows
description: MapmyIndia Interactive Vector Maps JS SDK for Web !
keywords:
  - Map
  - data
  - Info Windows
image: https://about.mappls.com/images/mappls-og.png
slug: /info-windows
title: Info Windows
sidebar_position: 9

---
 
 

 
### [InfoWindow Properties](#InfoWindow-Properties)

**Required Parameters**

- **Map Object**
- **Position**

**Example:**

```js
    Var infowindow =new mappls.InfoWindow({
            map:map,
            position: {"lng":"77.64534","lat":"28.5454"},
        });
```

**Optional Parameters**

- **Content:** It shows the popup content on the Info Window.

```js
    {
		content: "MapmyIndia"
	}
```

- **Class:** It shows the custom class name on the Info Window.

```js
    {
		class: info_class
	}
```

- **Offset:** It sets the exact location of the Info Window.

```js
    {
		offset: [0,10]
	}
```

- **MaxWidth:** It sets the width in pixels of the Info Window.

```js
    {
		maxWidth: 200
	}
```

- **closeButton:** It shows the Close button on the Info Window. By default it is `true`

```js
    {
		closeButton: true
	}
```

**Example**

```js
	infoWindow_object =new Mappls.InfoWindow({
		position: {"lng":"77.64534","lat":"28.5454"},
		class: info_class ( optional ),
		map: map_object,
		content: "MapmyIndia",
		offset: [0,10],
		maxWidth: 200
	});
```

### [Remove InfoWindow](#Remove-InfoWindow)

```js
	Mappls.remove({map: map_object, layer: infoWindow_object);
```


 