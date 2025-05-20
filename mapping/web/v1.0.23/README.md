[<img src="https://about.mappls.com/images/mappls-b-logo.svg" height="60"/> </p>](https://www.mapmyindia.com/api)

# Mappls Annotation Plugin

The Mappls Annotation Plugin simplifies the way to set and adjust the visual properties of annotations on a Mappls map.

This Plugin is uses to plot Symbol (marker), Line, Fill(Polygon) and circle on a Map.

### Add the dependency
Add below dependency in your app-level build.gradle
~~~groovy 
implementation 'com.mappls.sdk:annotation-plugin:1.0.1'
~~~

### Add your API keys to the SDK

_Add your API keys to the SDK (in your application's onCreate() or before using map)_
##### Java
~~~java	
MapplsAccountManager.getInstance().setRestAPIKey(getRestAPIKey());  	
MapplsAccountManager.getInstance().setMapSDKKey(getMapSDKKey());  		
MapplsAccountManager.getInstance().setAtlasClientId(getAtlasClientId());  	
MapplsAccountManager.getInstance().setAtlasClientSecret(getAtlasClientSecret());  	
~~~	
##### Kotlin	
~~~kotlin	
MapplsAccountManager.getInstance().restAPIKey = getRestAPIKey()  	
MapplsAccountManager.getInstance().mapSDKKey = getMapSDKKey()  		
MapplsAccountManager.getInstance().atlasClientId = getAtlasClientId()  	
MapplsAccountManager.getInstance().atlasClientSecret = getAtlasClientSecret()	
~~~

## Initialize the Annotation plugin
To initialise the plugin there are Four Manager classes:
1. `SymbolManager`
2. `LineManager`
3. `FillManager`
4. `CircleManager`

### Initialize SymbolManager (Marker)
