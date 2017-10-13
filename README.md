# simple-angucomplete-alt
The purpose of this package is to simplify the use of angucomplete-alt. It's easy to turn the [angucomplete-alt](https://github.com/ghiden/angucomplete-alt) into something more like a select-ajax.

When you connect ngModel to the selectedObject of the angucomplete, this package helps in migrating large select fields to the angucomplete without worrying about writing long AngularJS settings and functions.

# Install via bower
```bower install simple-angucomplete-alt```

After install, include the reference on your html:
```<script src="bower_components/simple-angucomplete-alt/simple-angucomplete-alt.js"></script>```

## use
#Include on yout HTML
```html
<simple-angucomplete 
	placeholder="Search clients"
	remote-url="my-url-that-will-return-clients?search="                                      
	title-field="name"
	description-field="document"	  
	ng-model="myModel"
	minlength="1"
/>
```

# Backend example my-url-that-will-return-clients
```php
//this is an example written in Laravel 5
//if send a id, return the specific register
if($request->id){
    return $pessoas->withTrashed()->find($request->id);
}
//else, do your like and return the registers in an ['results'=>array()]
return [
    'results'=>$pessoas->where('nome', 'like', '%'.$request->search.'%')
        ->orderByRaw('
            case when nome like "'.addslashes($request->search).'%" then 0
                 when nome like "%'.addslashes($request->search).'%" then 1
            end
        ')     
        ->orderByRaw('nome')
        ->limit(100)            
        ->get()
];
```
