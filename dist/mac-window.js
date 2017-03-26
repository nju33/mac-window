/*!
 * Copyright 2017, nju33
 * Released under the MIT License
 * https://github.com/nju33/mac-window
 */
var MacWindow = (function () {
'use strict';

function appendNode ( node, target ) {
	target.appendChild( node );
}

function insertNode ( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function detachNode ( node ) {
	node.parentNode.removeChild( node );
}

function createElement ( name ) {
	return document.createElement( name );
}

function createText ( data ) {
	return document.createTextNode( data );
}

function setAttribute ( node, attribute, value ) {
	node.setAttribute ( attribute, value );
}

function get ( key ) {
	return key ? this._state[ key ] : this._state;
}

function fire ( eventName, data ) {
	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
	if ( !handlers ) return;

	for ( var i = 0; i < handlers.length; i += 1 ) {
		handlers[i].call( this, data );
	}
}

function observe ( key, callback, options ) {
	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;

	( group[ key ] || ( group[ key ] = [] ) ).push( callback );

	if ( !options || options.init !== false ) {
		callback.__calling = true;
		callback.call( this, this._state[ key ] );
		callback.__calling = false;
	}

	return {
		cancel: function () {
			var index = group[ key ].indexOf( callback );
			if ( ~index ) group[ key ].splice( index, 1 );
		}
	};
}

function on ( eventName, handler ) {
	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
	handlers.push( handler );

	return {
		cancel: function () {
			var index = handlers.indexOf( handler );
			if ( ~index ) handlers.splice( index, 1 );
		}
	};
}

function set ( newState ) {
	this._set( newState );
	( this._root || this )._flush();
}

function _flush () {
	if ( !this._renderHooks ) return;

	while ( this._renderHooks.length ) {
		var hook = this._renderHooks.pop();
		hook.fn.call( hook.context );
	}
}

function noop () {}

function dispatchObservers ( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

var template = (function () {
return {
  oncreate() {
    const {container, box} = this.refs;
    const parent = container.parentElement;
    Array.prototype.slice.call(parent.children)
      .filter(el => !el.classList.contains('mac-window'))
      .forEach(el => box.appendChild(el));
  }
}
}());

let addedCss = false;
function addCss () {
	var style = createElement( 'style' );
	style.textContent = "\n[svelte-2394600066].container, [svelte-2394600066] .container {\n  position: absolute;\n  right: 50%;\n  bottom: 50%;\n  width: 100%;\n  height: 100%;\n  -webkit-transform: translate(50%, 50%);\n  transform: translate(50%, 50%);\n  border-radius: 4px;\n  border: 1px solid #ccc;\n}\n\n[svelte-2394600066].title-bar, [svelte-2394600066] .title-bar {\n  width: 100%;\n  height: 37px;\n  background: linear-gradient(to bottom, #e6e6e6, #d6d6d6);\n  position: absolute;\n  left: 0;\n  top: 0;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n}\n\n[svelte-2394600066].title-bar:before, [svelte-2394600066] .title-bar:before {\n  content: '';\n  position: absolute;\n  left: 12px;\n  bottom: 50%;\n  transform: translateY(50%);\n  width: 11px;\n  height: 11px;\n  \n  \n  border-radius: 50%;\n  background: #ff3d49;\n  box-shadow:\n    0 0 0 .5px #d6000d,\n    21px 0 0 0 #ffbd00,\n    21px 0 0 .5px #997100,\n    42px 0 0 0 #00d742,\n    42px 0 0 .5px #007123;\n}\n\n[svelte-2394600066].box, [svelte-2394600066] .box {\n  width: 100%;\n  height: 100%;\n  padding-top: 37px;\n  box-sizing: border-box;\n  border-bottom-left-radius: 4px;\n  border-bottom-right-radius: 4px;\n}\n";
	appendNode( style, document.head );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-2394600066', '' );
	component.refs.container = div;
	div.className = "mac-window container";
	
	var div1 = createElement( 'div' );
	setAttribute( div1, 'svelte-2394600066', '' );
	div1.className = "mac-window title-bar";
	
	appendNode( div1, div );
	appendNode( createText( "\n  " ), div );
	
	var div2 = createElement( 'div' );
	setAttribute( div2, 'svelte-2394600066', '' );
	component.refs.box = div2;
	div2.className = "mac-window box";
	
	appendNode( div2, div );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: noop,
		
		teardown: function ( detach ) {
			if ( component.refs.container === div ) component.refs.container = null;
			if ( component.refs.box === div2 ) component.refs.box = null;
			
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function MacWindow$1 ( options ) {
	options = options || {};
	this.refs = {};
	this._state = options.data || {};
	
	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};
	
	this._handlers = Object.create( null );
	
	this._root = options._root;
	this._yield = options._yield;
	
	this._torndown = false;
	if ( !addedCss ) addCss();
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
	
	if ( options._root ) {
		options._root._renderHooks.push({ fn: template.oncreate, context: this });
	} else {
		template.oncreate.call( this );
	}
}

MacWindow$1.prototype.get = get;
MacWindow$1.prototype.fire = fire;
MacWindow$1.prototype.observe = observe;
MacWindow$1.prototype.on = on;
MacWindow$1.prototype.set = set;
MacWindow$1.prototype._flush = _flush;

MacWindow$1.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

MacWindow$1.prototype.teardown = MacWindow$1.prototype.destroy = function destroy ( detach ) {
	this.fire( 'teardown' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

return MacWindow$1;

}());
