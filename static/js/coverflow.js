var finalCount;
var user_likes;
var user_friends;
var currentIndex;
var siteId = 'EBAY-US';
var countries;
var searching = 'Searching Products for "';
var dots = '"...';

 function _cb_findItemsByKeywords(root) {
    var results = JSON.parse(root.results);
    var items = results.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    var innerHTML = '';
    var _trackEvent = '_trackEvent';
    var purchase = 'Purchase';
    var ebay = 'Ebay';
    if (items.length) {
        for (var i = 0; i < items.length; ++i) {
            var item     = items[i];
            var title    = item.title;
            var pic      = item.galleryURL;
            var category = item.primaryCategory[0].categoryName[0];
            var viewitem = item.viewItemURL;
            var color = '#FFFFFF';

            if (null != title && null != viewitem) {
                if (i % 2 == 0) {
                    color = '#F2F2F2';
                }
                innerHTML += '<div class="product_cell" style="background-color:'+color+'"><img class="product_cell_image" src="' + pic + '"/><div class="title_text">'+title+'</div><div class="subtitle_text">'+category+'</div><div class="buy_button"><a href="'+viewitem+'" target="_blank" style="color: #FFFFFF" onclick="_gaq.push(['+_trackEvent+','+purchase+','+ebay+','+title+'])" >Buy</a></div></div>';
            }
        }
    } else {
        innerHTML += '<div class="product_cell" style="background-color:#F2F2F2"><img class="product_cell_image" src="static/img/not_found.png"/><div class="title_text" style="line-height:90px">No Products found for the selected Like.</div></div>';
    }
    var innHTML = document.getElementById("table_header").innerHTML;
    var currLike = user_likes[currentIndex];
    if (currLike.id == root.likeId) {
        document.getElementById("table_view").innerHTML = innerHTML;
        document.getElementById("table_header").innerHTML = root.likeName + '('+items.length+')';
    }
} 


 function populateFriendsTableView(friends) {
    var innerHTML = '';
    var innHTML = '';
    user_friends = friends;
    if (friends.length) {
        for(var i = 0; i < user_friends.length ; i++) {
            var friend = user_friends[i];
            var color = '#FFFFFF';
            if (i % 2 == 0) {
                color = '#F2F2F2';
            }
            innerHTML += '<div id="'+i+'"class="friends_table_cell" onclick="selectedFriend('+i+')" style="background-color:'+color+'"><img class="friends_profile_pic" src="https://graph.facebook.com/'+ friend.id +'/picture?type=small"/><div class="friends_name_text">'+friend.name+'</div></div>';
        }
        innHTML = 'My Friends';
        document.getElementById("friends_table_header").innerHTML = innHTML;
    } else {
        innHTML = 'Login to see Friends'; 
        document.getElementById("friends_table_header").innerHTML = innHTML;
    }
    document.getElementById("friends_table_view").innerHTML = innerHTML;
 }


  function populateCoverflow(likes){
        user_likes = likes;
        finalCount = 1;
        if (user_likes.length) {
            var like = likes[0];
            didGetTheFinalIndex(0);
            var innerHTML = '';
            for (var i = 0; i < likes.length; i++) {
                var like = likes[i];
                //https://graph.facebook.com/user_id/picture?type=large
                innerHTML += '<img id="'+i+'" src="https://graph.facebook.com/'+ like.id +'/picture?type=large"></img>';
                // var imagepath = "{{url_for('static',filename='images/14.jpg')}}";
                // innerHTML += '<img id="'+i+'"src="'+imagepath+'"/>';
            }
            document.getElementById('content').innerHTML = innerHTML;
            finalCount = user_likes.length;
        } else {
            var innerHTML = '<img id="0" src="static/img/not_found.png"></img>';
            document.getElementById('content').innerHTML = innerHTML;

            innerHTML = '<div class="product_cell" style="background-color:#F2F2F2"><img class="product_cell_image" src="static/img/not_found.png"/><div class="title_text" style="line-height:90px">No Products found for the selected Like.</div></div>';
            document.getElementById("table_view").innerHTML = innerHTML;

            innerHTML = 'You have no Likes yet.';
            document.getElementById("table_header").innerHTML = innerHTML;
        }
        window.onload();
    }


function loadProductsForLike(like) { 
    document.getElementById("table_header").innerHTML = searching+like.name+dots;
    var innerHTML = '<img id="loading" src="static/img/loading.gif"/>';
    document.getElementById("table_view").innerHTML = innerHTML;
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('POST', "/products", true); 
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            _cb_findItemsByKeywords(JSON.parse(xobj.responseText));
        }
    };
    xobj.send("{'likeId':'"+like.id+"', 'likeName':'"+like.name+"', 'siteId':'"+siteId+"'}");  
}


function didGetTheFinalIndex(index) {
    currentIndex = index;
    loadProductsForLike(user_likes[currentIndex]);
}

window.onload = function () {
    'use strict';

    var count, images, dim, offset, center, angle, dist, shift,
        pressed, reference, amplitude, target, velocity, timeConstant,
        xform, frame, timestamp, ticker;

    function initialize() {
        pressed = false;
        timeConstant = 250; // ms
        dim = 200;
        offset = target = 0;
        angle = -60;
        dist = -150;
        shift = 10;
        count = finalCount;
        images = [];
        while (images.length < count) {
            var view = document.getElementById(images.length);
            images.push(view);
        }
    }

    function setupEvents() {
        var view = document.getElementById('content');
        if (typeof window.ontouchstart !== 'undefined') {
            view.addEventListener('touchstart', tap);
            view.addEventListener('touchmove', drag);
            view.addEventListener('touchend', release);
        }
        view.addEventListener('mousedown', tap);
        view.addEventListener('mousemove', drag);
        view.addEventListener('mouseup', release);
        document.addEventListener('keydown', handleKey);
    }

    function xpos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientX;
        }

        // mouse event
        return e.clientX;
    }

    function wrap(x) {
        return (x >= count) ? (x % count) : (x < 0) ? wrap(count + (x % count)) : x;
    }

    function scroll(x) {
        var i, half, delta, dir, tween, el, alignment;

        offset = (typeof x === 'number') ? x : offset;
        center = Math.floor((offset + dim / 2) / dim);
        delta = offset - center * dim;
        dir = (delta < 0) ? 1 : -1;
        tween = -dir * delta * 2 / dim;

        alignment = 'translateX(' + (innerWidth - dim) / 2 + 'px) ';
        alignment += 'translateY(10px)';

        // center
        el = images[wrap(center)];
        el.style[xform] = alignment +
            ' translateX(' + (-delta / 2) + 'px)' +
            ' translateX(' + (dir * shift * tween) + 'px)' +
            ' translateZ(' + (dist * tween) + 'px)' +
            ' rotateY(' + (dir * angle * tween) + 'deg)';
        el.style.zIndex = 0;
        el.style.opacity = 1;

        half = count >> 1;
        for (i = 1; i <= half; ++i) {
            // right side
            el = images[wrap(center + i)];
            el.style[xform] = alignment +
                ' translateX(' + (shift + (dim * i - delta) / 2) + 'px)' +
                ' translateZ(' + dist + 'px)' +
                ' rotateY(' + angle + 'deg)';
            el.style.zIndex = -i;
            el.style.opacity = (i === half && delta < 0) ? 1 - tween : 1;

            // left side
            el = images[wrap(center - i)];
            el.style[xform] = alignment +
                ' translateX(' + (-shift + (-dim * i - delta) / 2) + 'px)' +
                ' translateZ(' + dist + 'px)' +
                ' rotateY(' + -angle + 'deg)';
            el.style.zIndex = -i;
            el.style.opacity = (i === half && delta > 0) ? 1 - tween : 1;
        }

        // center
        el = images[wrap(center)];
        el.style[xform] = alignment +
            ' translateX(' + (-delta / 2) + 'px)' +
            ' translateX(' + (dir * shift * tween) + 'px)' +
            ' translateZ(' + (dist * tween) + 'px)' +
            ' rotateY(' + (dir * angle * tween) + 'deg)';
        el.style.zIndex = 0;
        el.style.opacity = 1;
    }
    function track() {
        var now, elapsed, delta, v;

        now = Date.now();
        elapsed = now - timestamp;
        timestamp = now;
        delta = offset - frame;
        frame = offset;

        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
    }

    function whichTransitionEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
          'transition':'transitionend',
          'OTransition':'oTransitionEnd',
          'MozTransition':'transitionend',
          'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    /* Listen for a transition! */

    function autoScroll() {
        var elapsed, delta;
        if (amplitude) {
            elapsed = Date.now() - timestamp;
            delta = amplitude * Math.exp(-elapsed / timeConstant);
            if (delta > 4 || delta < -4) {
                scroll(target - delta);
                requestAnimationFrame(autoScroll);
            } else {
                scroll(target);
                didGetTheFinalIndex(wrap(center));
            }
        }
    }

    function tap(e) {
        pressed = true;
        reference = xpos(e);

        velocity = amplitude = 0;
        frame = offset;
        timestamp = Date.now();
        clearInterval(ticker);
        ticker = setInterval(track, 100);

        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function drag(e) {
        var x, delta;
        if (pressed) {
            x = xpos(e);
            delta = reference - x;
            if (delta > 2 || delta < -2) {
                reference = x;
                scroll(offset + delta);
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function release(e) {
        pressed = false;

        clearInterval(ticker);
        target = offset;
        if (velocity > 10 || velocity < -10) {
            amplitude = 0.9 * velocity;
            target = offset + amplitude;
        }
        target = Math.round(target / dim) * dim;
        amplitude = target - offset;
        timestamp = Date.now();
        requestAnimationFrame(autoScroll);
        e.preventDefault();
        e.stopPropagation();

        return false;
    }

    function handleKey(e) {
        if (!pressed && (target === offset)) {
            // Space or PageDown or RightArrow or DownArrow
            if ([32, 34, 39, 40].indexOf(e.which) >= 0) {
                target = offset + dim;
            }
            // PageUp or LeftArrow or UpArrow
            if ([33, 37, 38].indexOf(e.which) >= 0) {
                target = offset - dim;
            }
            if (offset !== target) {
                amplitude = target - offset;
                timestamp = Date.now();
                requestAnimationFrame(autoScroll);
                return true;
            }
        }
    }

    xform = 'transform';
    ['webkit', 'Moz', 'O', 'ms'].every(function (prefix) {
        var e = prefix + 'Transform';
        if (typeof document.body.style[e] !== 'undefined') {
            xform = e;
            return false;
        }
        return true;
    });

    window.onresize = scroll;

    initialize();
    setupEvents();
    scroll(offset);
};
