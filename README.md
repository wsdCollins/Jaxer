# Wsd Jaxer Application Server

**Abstract**
Jaxer is a server-side Javascript server, which is literally "Javascript on the server". Jaxer works similar to a manner of PHP in that multiple threads are created to syncronously handle works loads for calls to the server. 

![Jx Mascot](https://i.imgur.com/25MYjG9.png)

Jaxer is an application that allows you to write server-side Javascript code as if you were writing on the client and then call it seamlessly.
The best way to describe it is to show an example of it working:

```
<!doctype html>
<html>

	<head>
		
		<title>Hello, Jaxer</title>
		<meta charset="utf-8"/>
			
		<script runat="server-proxy">
			
			function Hello() {
				return "Hello from Jaxer!!!";
			}

		</script>

	</head>

	<body>
		
		<h2>Try It!!</h2>
		<button onclick="callJaxer()">Click Me!!</button>
		<p id="p"></p>
		
		<script type="text/javascript">

			async function callJaxer() {
				
				let p = document.getElementById("p");
				p.textContent = await Jaxer.async.Hello();

			}

		</script>

	</body>

</html>
```

### Current Issues

1. Document Build Process  (in progress)
2. Update Client Framework  
3. Update Server Framework  
4. Write tutorials  

### License

Jaxer is currently licensed under GPLv3 by the original authors. As NodeJS, PHP are licensed under the MIT license,
we think that a more permissive license would help Jaxer grow by allow more organizations to adopt, adapt, and then
contribute back changes as they see fit.

### Trademark

Currently the Jaxer trademark is managed by Appcelerator, and will continue to use it unless we compelled to otherwise.
Though as Nodejs was forked into IO.js, right now there's no community built around Jaxer to really require adoption
of the name. We more find it a fitting match for the "Javascript Application Server", and to show where this technology
has originated from. 

### Logo

We've change the logo from an orange Gear to a more modern vector gear bubbling off into the ether. We think this is
a better match to show how the client side framework interacts and seamlessly works with the server side Javascript.
The logo is originally from 
[Shutterstock](https://www.shutterstock.com/image-vector/gear-pixel-logo-template-design-vector-356978525)
to use as a placeholder.

