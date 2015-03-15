'use strict'

var images = [],
    $body = $('body'),
    $window = $(window),
    wh = $window.height(),
    ww = $window.width(),
    vh = wh - 50,
    prevURL = null,
    nextURL = null,
    $nextprev = $('span.nextprev'),
    $title = $('title'),
    title = $title.text(),
    boxSize = 250,
    boxSizeD = ww / boxSize,
    boxSizeI = parseInt(ww / boxSize, 10),
    defOpacity = 0.75,
    overlayOpacity = 0.9,
    fontSize = 14;

if (boxSizeD > boxSizeI)
  boxSize += (ww - (boxSize * boxSizeI)) / boxSizeI;

if (title.indexOf('newest submissions : ') > -1)
  title = title.substr(21);

$('a', $nextprev).each(function () {
  var $a = $(this);

  if ($a.text().indexOf('prev') > -1)
    prevURL = $a.attr('href');
  else if ($a.text().indexOf('next') > -1)
    nextURL = $a.attr('href');
});

$('a.title').each(function () {
  var $a = $(this),
      href = $a.attr('href'),
      ttl = $a.text();

  if (ttl.indexOf('r/') > -1) {
    var ttlb = '',
        ttls = '',
        ttla = '',
        io = ttl.indexOf('r/'),
        ttlbep = -1,
        ttlasp = -1;

    for (var i = io; i > -1; i--) {
      if (ttl.substr(i, 1) == ' ') {
        ttlbep = i;
        break;
      }
    }

    if (ttlbep > -1)
      ttlb = ttl.substr(0, ttlbep);

    for (var i = io; i < ttl.length; i++) {
      if (ttl.substr(i, 1) == ' ') {
        ttlasp = i;
        break;
      }
    }

    if (ttlasp > -1)
      ttla = ttl.substr(ttlasp);

    if (ttlbep > -1) {
      if (ttlasp == -1)
        ttls = ttl.substr(ttlbep +1);
      else
        ttls = ttl.substr(ttlbep +1, ttlasp - ttlbep);
    }

    if (ttls.length > 0 &&
        ttls.substr(0, 1) != '/')
      ttls = '/' + ttls;

    if (ttls != '')
      ttl = ttlb + ' <a href="' + ttls + '" style="display: inline; height: auto;" target="_blank">' + ttls + '</a> ' + ttla;
  }

  if (href.indexOf('imgur.com') == -1)
    return;

  if (href.indexOf('imgur.com/a/') > -1 ||
      href.indexOf('imgur.com/gallery/') > -1 ||
      href.indexOf('.gifv') > -1)
    return;

  if (href.substr(href.length -1) == '?')
    href = href.substr(0, href.length -1);

  if (href.indexOf('.jpg') == -1 &&
      href.indexOf('.jpeg') == -1 &&
      href.indexOf('.gif') == -1 &&
      href.indexOf('.png') == -1)
    href += '.png';

  var $entry = $a.parent().parent(),
      $buttons = $('ul.buttons', $entry),
      $nsfw = $('li.nsfw-stamp', $buttons),
      $tagline = $('p.tagline', $entry),
      $score = $('span.unvoted', $tagline),
      $author = $('a.author', $entry),
      isNSFW = false,
      commentsURL = null,
      comments = 0,
      points = parseInt($score.text().substr(0, $score.text().indexOf(' ')), 10),
      author = $author.text();

  if ($nsfw.length > 0)
    isNSFW = true;

  $('li', $buttons).each(function () {
    var $c = $('a.comments', $(this));

    if ($c.length > 0) {
      commentsURL = $c.attr('href');

      if ($c.text() != 'comment')
        comments = parseInt($c.text().substr(0, $c.text().indexOf(' ')), 10);
    }
  });

  images.push({
    imageURL: href,
    commentsURL: commentsURL,
    title: ttl,
    comments: comments,
    isNSFW: isNSFW,
    points: points,
    author: author
  });
});

var $prev = $('<a>')
      .attr('href', prevURL)
      .css({
        display: 'inline-block',
        fontSize: fontSize,
        paddingRight: 10
      })
      .text('Prev'),

    $next = $('<a>')
      .attr('href', nextURL)
      .css({
        display: 'inline-block',
        fontSize: fontSize,
        paddingRight: 30
      })
      .text('Next'),

    $imageCount = $('<span>')
      .css({
        display: 'inline-block',
        fontSize: fontSize,
        paddingRight: 30
      })
      .text('Displaying ' + images.length + ' images'),

    $titleText = $('<span>')
      .css({
        fontSize: fontSize,
      })
      .html('Reddit Gallery of <a href="' + window.location.href + '">' + title + '</a>');

    $left = $('<div>')
      .css({
        float: 'left',
        paddingLeft: 16,
        paddingTop: 16
      })
      .append($prev)
      .append($next)
      .append($imageCount)
      .append($titleText);

var $close = $('<a>')
      .attr('href', window.location.href)
      .css({
        fontSize: fontSize,
      })
      .text('Close'),

    $right = $('<div>')
      .css({
        float: 'right',
        paddingRight: 16,
        paddingTop: 16
      })
      .append($close);

var $header = $('<div>')
      .css({
        backgroundColor: '#fff',
        height: 50,
        left: 0,
        overflow: 'hidden',
        position: 'fixed',
        right: 0,
        top: 0,
        zIndex: 99
      })
      .append($left)
      .append($right);

var $gallery = $('<div>')
      .css({
        marginTop: 50,
        paddingBottom: 50,
        width: '100%'
      });

images.forEach(function (image) {
  var $header = $('<header>')
        .css({
          backgroundColor: '#fff',
          color: '#000',
          fontSize: fontSize,
          padding: 10,
          textAlign: 'center',
          opacity: overlayOpacity
        })
        .html(image.title),

      $a = $('<a>')
        .addClass('blanket')
        .attr('href', image.imageURL)
        .attr('target', '_blank')
        .css({
          display: 'block',
          height: boxSize,
          width: '100%'
        }),

      $points = $('<a>')
        .attr('href', image.commentsURL)
        .attr('target', '_blank')
        .css({
          display: 'block',
          float: 'left',
          fontSize: 10,
          paddingLeft: 10
        })
        .text(image.points + ' point' + (image.points == 1 ? '' : 's') + ', ' + image.comments + ' comment' + (image.comments == 1 ? '' : 's')),

      $user = $('<a>')
        .attr('href', '/u/' + image.author)
        .attr('target', '_blank')
        .css({
          display: 'block',
          float: 'right',
          fontSize: 10,
          paddingRight: 10
        })
        .text(image.author),

      $footer = $('<footer>')
        .css({
          backgroundColor: '#fff',
          color: '#000',
          height: 22,
          opacity: overlayOpacity,
          overflow: 'hidden',
          paddingTop: 8
        })
        .append($points)
        .append($user);

      $box = $('<div>')
        .addClass('galleryBox')
        .css({
          backgroundImage: 'url(' + image.imageURL + ')',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          float: 'left',
          height: boxSize,
          opacity: defOpacity,
          overflow: 'hidden',
          width: boxSize
        })
        .mouseenter(function () {
          var $box = $(this),
              $header = $('header', $box),
              $a = $('a.blanket', $box),
              $footer = $('footer', $box),
              hh = $header.height() + 20,
              animSpeed = 150;

          $box.animate({
            opacity: 1
          }, animSpeed);

          $header.animate({
            marginTop: 0
          }, animSpeed);

          $a.animate({
            height: boxSize - (30 + hh)
          }, animSpeed);
        })
        .mouseleave(function () {
          var $box = $(this),
              $header = $('header', $box),
              $a = $('a.blanket', $box),
              $footer = $('footer', $box),
              hh = $header.height() + 20,
              animSpeed = 100;

          $box.animate({
            opacity: defOpacity
          }, animSpeed);

          $header.animate({
            marginTop: (0 - hh)
          }, animSpeed);

          $a.animate({
            height: boxSize
          }, animSpeed);
        })
        .append($header)
        .append($a)
        .append($footer);

  $gallery.append($box);
});

var $wrapper = $('<div>')
      .addClass('redditGallery')
      .css({
        width: '100%'
      })
      .append($header)
      .append($gallery);

if (prevURL == null)
  $prev.hide();

if (nextURL == null)
  $next.hide();

$body.children().remove();
$body.append($wrapper);
$body.css({ backgroundColor: '#000' });

$('div.galleryBox').each(function () {
  var $box = $(this),
      $header = $('header', $box),
      hh = $header.height() + 20;

  $header
    .css({
      marginTop: (0 - hh)
    });
});
