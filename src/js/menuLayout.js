$(document).ready(function($) {
  function dropdownMenu(element) {
    fetch(
      "https://jsonblob.com/api/jsonBlob/6766327f-607d-11e9-95ef-9bcb815ba4a4"
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        appendData(myJson);
      })
      .catch(function(err) {
        console.log(err);
      });
    let appendData = myJsonData => {
      Object.keys(myJsonData).map((key, i) => {
       // console.log(key);
        $("#primaryMenu").append(
          '<li class="has-dropdown" data-content="' +
            key +
            '"><a href="#0">' +
            key +
            "</a></li>"
        );
        $("#dropdown-listData").append(
          "<li id='" +
            key +
            "' class='dropdown'" +
            key +
            "><a href='#0' class='label'>" +
            key +
            "</a></li>"
        );

        Object.keys(myJsonData[key]).map((data, i) => {
          //console.log(myJsonData[key][data]["title"]);
          let lowerCaseItem = myJsonData[key][data]["title"]
            .toLowerCase()
            .replace(/\s/g, "");

          $("#dropdown-listData li#" + key).append(
            '<div class="content"><a class="linkContainer item-' +
              lowerCaseItem +
              '"href="/' +
              lowerCaseItem +
              '"><h3 class="linkTitle">' +
              myJsonData[key][data]["title"] +
              '</h3><p class="linkSub">' +
              myJsonData[key][data]["sub-title"] +
              "</p></a></div></li>"
          );
        });
        
      });
      this.element = element;
      this.mainNavigation = this.element.find(".main-nav");
      this.mainNavigationItems = this.mainNavigation.find(".has-dropdown");
      this.dropdownList = this.element.find(".dropdown-list");
      this.dropdownWrappers = this.dropdownList.find(".dropdown");
      this.dropdownItems = this.dropdownList.find(".content");
      this.dropdownBg = this.dropdownList.find(".bg-layer");
      this.mq = this.checkMq();
      this.bindEvents();
    };
  }

  dropdownMenu.prototype.checkMq = function() {
    let self = this;
    return window
      .getComputedStyle(self.element.get(0), "::before")
      .getPropertyValue("content")
      .replace(/'/g, "")
      .replace(/"/g, "")
      .split(", ");
  };

  dropdownMenu.prototype.bindEvents = function() {
    let self = this;
    this.mainNavigationItems
      .mouseenter(function(event) {
        self.showDropdown($(this));
      })
      .mouseleave(function() {
        setTimeout(function() {
          if (
            self.mainNavigation.find(".has-dropdown:hover").length == 0 &&
            self.element.find(".dropdown-list:hover").length == 0
          )
            self.hideDropdown();
        }, 50);
      });
    this.dropdownList.mouseleave(function() {
      setTimeout(function() {
        self.mainNavigation.find(".has-dropdown:hover").length == 0 &&
          self.element.find(".dropdown-list:hover").length == 0 &&
          self.hideDropdown();
      }, 50);
    });
    this.mainNavigationItems.on("touchstart", function(event) {
      let selectedDropdown = self.dropdownList.find(
        "#" + $(this).data("content")
      );
      if (
        !self.element.hasClass("is-dropdown-visible") ||
        !selectedDropdown.hasClass("active")
      ) {
        event.preventDefault();
        self.showDropdown($(this));
      }
    });
    this.element.on("click", ".nav-trigger", function(event) {
      event.preventDefault();
      self.element.toggleClass("nav-open");
      self.resetDropdown();
    });
  };

  dropdownMenu.prototype.showDropdown = function(item) {
    this.mq = this.checkMq();
    if (this.mq == "desktop") {
      let self = this;
      let selectedDropdown = this.dropdownList.find("#" + item.data("content")),
        selectedDropdownHeight = selectedDropdown.innerHeight(),
        selectedDropdownWidth = selectedDropdown
          .children(".content")
          .innerWidth(),
        selectedDropdownLeft =
          item.offset().left +
          item.innerWidth() / 2 -
          selectedDropdownWidth / 2;
      this.updateDropdown(
        selectedDropdown,
        parseInt(selectedDropdownHeight),
        selectedDropdownWidth,
        parseInt(selectedDropdownLeft)
      );
      this.element.find(".active").removeClass("active");
      selectedDropdown
        .addClass("active")
        .removeClass("move-left move-right")
        .prevAll()
        .addClass("move-left")
        .end()
        .nextAll()
        .addClass("move-right");
      item.addClass("active");
      if (!this.element.hasClass("is-dropdown-visible")) {
        setTimeout(function() {
          self.element.addClass("is-dropdown-visible");
        }, 10);
      }
    }
  };

  dropdownMenu.prototype.updateDropdown = function(
    dropdownItem,
    height,
    width,
    left
  ) {
    this.dropdownList.css({
      "-moz-transform": "translateX(" + left + "px)",
      "-webkit-transform": "translateX(" + left + "px)",
      "-ms-transform": "translateX(" + left + "px)",
      "-o-transform": "translateX(" + left + "px)",
      transform: "translateX(" + left + "px)",
      width: width + "px",
      height: height + "px"
    });

    this.dropdownBg.css({
      "-moz-transform": "scaleX(" + width + ") scaleY(" + height + ")",
      "-webkit-transform": "scaleX(" + width + ") scaleY(" + height + ")",
      "-ms-transform": "scaleX(" + width + ") scaleY(" + height + ")",
      "-o-transform": "scaleX(" + width + ") scaleY(" + height + ")",
      transform: "scaleX(" + width + ") scaleY(" + height + ")"
    });
  };

  dropdownMenu.prototype.hideDropdown = function() {
    this.mq = this.checkMq();
    if (this.mq == "desktop") {
      this.element
        .removeClass("is-dropdown-visible")
        .find(".active")
        .removeClass("active")
        .end()
        .find(".move-left")
        .removeClass("move-left")
        .end()
        .find(".move-right")
        .removeClass("move-right");
    }
  };

  dropdownMenu.prototype.resetDropdown = function() {
    this.mq = this.checkMq();
    if (this.mq == "mobile") {
      this.dropdownList.removeAttr("style");
    }
  };

  let dropDownArr = [];
  if ($(".header-menu-dropdown").length > 0) {
    $(".header-menu-dropdown").each(function() {
      dropDownArr.push(new dropdownMenu($(this)));
    });

    let resizing = false;
    updateDropdownPosition();
    $(window).on("resize", function() {
      if (!resizing) {
        resizing = true;
        !window.requestAnimationFrame
          ? setTimeout(updateDropdownPosition, 300)
          : window.requestAnimationFrame(updateDropdownPosition);
      }
    });

    function updateDropdownPosition() {
      dropDownArr.forEach(function(element) {
        element.resetDropdown();
      });

      resizing = false;
    }
  }
});
