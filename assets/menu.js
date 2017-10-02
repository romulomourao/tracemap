const settings = require('electron-settings');

window.navigation = window.navigation || {},
function(n) {
    navigation.menu = {
      constants: {
        sectionTemplate: '.section-template',
        contentContainer: '#map',
        startSectionMenuItem: '#welcome-menu',
        startSection: '#graph-container',
        resetZoom: {
          id: '#reset-zoom',
          settingName: 'map.reset_zoom'
        }
      },

      importSectionsToDOM: function() {
        const links = document.querySelectorAll('link[rel="import"]')
        Array.prototype.forEach.call(links, function (link) {
          let template = link.import.querySelector(navigation.menu.constants.sectionTemplate)
          let clone = document.importNode(template.content, true)
          document.querySelector(navigation.menu.constants.contentContainer).appendChild(clone)
        })
      },

      setMenuOnClickEvent: function () {
        document.body.addEventListener('click', function (event) {
          if (event.target.dataset.section) {
            navigation.menu.hideAllSections()
            navigation.menu.showSection(event)
          }
        })
      },

      showSection: function(event) {
        const sectionId = event.target.dataset.section
        $('#' + sectionId).show()
        $('#' + sectionId + ' section').show()
      },

      showStartSection: function() {
        $(this.constants.startSectionMenuItem).click()
        $(this.constants.startSection).show()
        $(this.constants.startSection + ' section').show()
      },

      loadSettings: function() {
        const resetZoomSettingName = this.constants.resetZoom.settingName

        resetZoom = settings.get(resetZoomSettingName, true)

        const resetZoomCheckbox = $(this.constants.resetZoom.id)

        resetZoomCheckbox.prop('checked', resetZoom)
        resetZoomCheckbox.change(function() {
          settings.set(resetZoomSettingName, resetZoomCheckbox.prop('checked'))
        })
      },

      hideAllSections: function() {
        $(this.constants.contentContainer + ' section').hide()
      },

      init: function() {
        this.importSectionsToDOM()
        this.setMenuOnClickEvent()
        this.showStartSection()
        this.loadSettings()
      }
    };

    n(function() {
        navigation.menu.init()
    })

}(jQuery);