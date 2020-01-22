var myFunctions = (function() {

      var takeMeThere = function(elementID) {
        if (elementID) {
          var ele = document.querySelector(elementID);
          var distance = ele.getBoundingClientRect().top;
          window.scrollTo({
            top: distance,
            left: 0,
            behavior: 'smooth'
          });
        }
      };

      var doSomething = function() {
        console.log("You clicked the thingy.");
      };

      return {
        getTakeMeThere: function() {
          return takeMeThere;
        },
        getDoSomething: function() {
          return doSomething;
        }
      }

    })();

    var theDOM = (function() {

      var strings = {
        headerOne: "#headerSectionOne",
        headerTwo: "#headerSectionTwo",
        headerThree: "#headerSectionThree",
        footerOne: "#footerSectionOne",
        footerTwo: "#footerSectionTwo",
        footerThree: "#footerSectionThree"
      };

      return {
        getStrings: function() {
          return strings;
        }
      };

    })();

    var controller = (function() {

      var setupEvents = function() {

        var strings = theDOM.getStrings();
        var scrollToHere = myFunctions.getTakeMeThere();
        var doStuff = myFunctions.getDoSomething();

        document.querySelector(strings.headerOne).addEventListener("click", function() {
          scrollToHere(strings.footerOne);
        });
        document.querySelector(strings.headerTwo).addEventListener("click", function() {
          scrollToHere(strings.footerTwo);
        });
        document.querySelector(strings.headerThree).addEventListener("click", function() {
          scrollToHere(strings.footerThree);
        });
        document.querySelector(strings.footerThree).addEventListener("click", function() {
          doStuff();
        });

      };

      return {
        init: function() {
          setupEvents();
        }
      };

    })(myFunctions, theDOM);

    controller.init(); /*  Start JavaScript Manipulation  */
