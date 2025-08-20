document.addEventListener("DOMContentLoaded", function (event) {
  var randomNum = Math.floor(Math.random() * 1000000) + 1  ;

  arenaDisplay = {

    fetch: function (slug, per, container) {
      let allContents = [];
      let page = 1;
      let randomNum = Math.floor(Math.random() * 1000000) + 1;

      function fetchPage() {
        // Are.na API supports ?page= and ?per= (max per=100)
        var fetchURL = 'https://api.are.na/v2/channels/' + slug + '/?per=100&page=' + page + '&nocache=' + randomNum;
        fetch(fetchURL, { method: 'get' })
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.contents && data.contents.length > 0) {
              allContents = allContents.concat(data.contents);
              page++;
              fetchPage(); // Fetch next page
            } else {
              // All pages fetched, now parse
              data.contents = allContents.reverse(); // Reverse if you want newest first
              arenaDisplay.parseChannel(data, container);
            }
          })
          .catch(function (err) {
            console.log('fetch failed');
          });
      }

      fetchPage();
    },

    parseChannel: function (data, container) {
      var channel = {};
      channel.title = data.title;
      channel.contents = data.contents.reverse();
      channel.url = 'https://are.na/' + data.user.slug + '/' + data.slug + '/';



      console.log(data);
      // console.log(channel);



      if (data.metadata !== null) {
        var channelDescription = data.metadata.description;
        var channelDescriptionKeywordCheck = channelDescription.toLowerCase();
        if ( channelDescriptionKeywordCheck.includes("text") ) {
          document.querySelector('body').setAttribute('data-template', 'text');
        };
      }

      channel.contents.forEach(function (entry) {
        // console.log(entry);
        if (entry.class === 'Image') {

          if (entry.source !== null) {
            var source = entry.source.url
          } else {
            var source = entry.image.original.url
          };


          var randomNum = Math.random(); // randomNum is between 0 and 1

          if (randomNum < 1/3) {
            var size = 'small';
          } else if (randomNum < 2/3) {
            var size = 'medium';
          } else {
            var size = 'large';
          }


          var entryHTML = '<figure class="work ' + size + '">'
                + '<img src="' + entry.image.original.url + '">'
                + '<figcaption>'
                  + entry.title + entry.description_html
                + '</figcaption>'
              + '</figure>';
        }


          // var entryHTML = '<figure class="work ' + size + '">'
          //       + '<img src="' + entry.image.original.url + '">'
          //       + '<div class="dropdown">'
          //         +  '<button class="dropbtn">'
          //           + entry.title
          //             +  '<i class="fa fa-caret-down"></i>'
          //         + '</button>'
          //         + '<div class="dropdown-content" id="myDropdown">'
          //         + entry.description_html
          //         + '</div>'
          //       + '</div>'
          //     + '</figure>'
          // }




        else if (entry.class === 'Link') {
          if (entry.title !== "") {
            var title = entry.title
          } else {
            var str = entry.source.url;
            var title = str.replace("https://", "");
            title = title.replace("http://", "");
            title = title.replace("/", "");

          };

          var entryHTML = '<div class="block -'
            + entry.class
            + '">'
            + '<a target="_blank" class="portal"'
            + 'href="'
            + entry.source.url
            + '">'
            + title
            + '</a>'
            + '</div>';
        }

        else if (entry.class === 'Media') {
          var entryHTML = '<article>'
              + '<figure>'
              + entry.embed.html
              + '<figcaption>'
              + '<a  target="_blank" '
              + 'href="'
              + entry.source.url
              + '">'
              + entry.title
              + '</a>'
              + '</figcaption>'
              + '</figure>'
            + '</article>';
        }

        else if (entry.class === 'Attachment') {
          if (entry.attachment.extension === "mp4") {
            var entryHTML = '<div class="block -'
              + entry.class
              + '">'
              + '<figure>'
              + '<video autoplay loop muted>'
              + '<source src="' + entry.attachment.url + '">'
              + '</video>'
              + '</figure>'
              + '<a target="_blank" '
              + 'href="'
              + entry.attachment.url
              + '">'
              + entry.title
              + '</a>'
              + '</div>';
          } else if (entry.attachment.extension === "pdf") {
            var entryHTML = '<figure>'
              + '<img src="' + entry.image.display.url + '">'
              + '</figure>';
          }

        }

        else if (entry.class === 'Text') {
          var entryHTML = '<article>'
          + '<div class="text-block">'
              + entry.content_html
            + '</div>'
          + '</article>';
        }

        else if (entry.class === 'Channel') {
          var str = entry.title;
          var split = str.split("");
          var wordhtml = '';
          for (let i = 0; i < split.length; i++) {
            wordhtml += '<span>' + split[i] + '</span>';
          };

          var entryHTML = '<article>'
            + '<p>'
            + '<a class="sparkle-portal" href="/i/index.php?id='
              + entry.slug
              + '">'
              + wordhtml
              + '</a>'
            +'</p>'
          + '</article>';
        }

        container.innerHTML += entryHTML;

        document.querySelector('body').setAttribute('data-state', 'ready');

      });
    }

  };

});
