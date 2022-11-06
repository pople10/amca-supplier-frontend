import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import MetisMenu from 'metismenujs/dist/metismenujs';

import { MENU } from './menu';
import { MenuItem } from './menu.model';
import { Router, NavigationEnd } from '@angular/router';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, AfterViewInit {

  @ViewChild('sidebarToggler') sidebarToggler: ElementRef;

  menuItems = [];
  @ViewChild('sidebarMenu') sidebarMenu: ElementRef;

  isAdmin = false;

  isUpdate = false;

  refExposant ;

  constructor(@Inject(DOCUMENT) private document: Document,private renderer: Renderer2, public router: Router, public languageService: LanguageService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {

        /**
         * Activating the current active item dropdown
         */
        this._activateMenuDropdown();

        /**
         * closing the sidebar
         */
        if (window.matchMedia('(max-width: 991px)').matches) {
          this.document.body.classList.remove('sidebar-open');
          console.log(this.document.getElementById("sidebar"));
          this.document.getElementById("sidebar").classList.add("mobile-ar-sidebar");
        }else{
          this.document.getElementById("sidebar").classList.remove("mobile-ar-sidebar");
        }
        //show sidebar on mouseover
        document.querySelector('.sidebar').addEventListener("mouseover", function () {
          document.getElementsByTagName('body')[0].classList.add('open-sidebar-folded');
        });
        //hide sidebar on mouseout
        document.querySelector('.sidebar').addEventListener("mouseout", function () {
          document.getElementsByTagName('body')[0].classList.remove('open-sidebar-folded');
        });

      }
    });
  }

  ngOnInit(): void {
    let userData = localStorage.getItem("userData");
    if(userData == null){
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      localStorage.removeItem("expiredAt");
      this.router.navigate(["/"]);
    }else{
      let data = JSON.parse(userData);
      let roles = data.roles;
      this.isAdmin = (roles.includes("admin") != null) ? roles.includes("admin") : false;
    }
    this.menuItems = MENU;

    /**
     * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
     */
    const desktopMedium = window.matchMedia('(min-width:992px) and (max-width: 1199px)');
    desktopMedium.addListener(this.iconSidebar);
    this.iconSidebar(desktopMedium);
  }

  ngAfterViewInit() {
    if(!this.router.url.includes("dashboard")){
      this.sidebarToggler.nativeElement.classList.toggle('active');
      this.sidebarToggler.nativeElement.classList.toggle('not-active');
      if (window.matchMedia('(min-width: 992px)').matches) {
        this.document.body.classList.toggle('sidebar-folded');
      } else if (window.matchMedia('(max-width: 991px)').matches) {
        this.document.body.classList.toggle('sidebar-open');
      }
    }
    // activate menu item
    new MetisMenu(this.sidebarMenu.nativeElement);

    this._activateMenuDropdown();
  }

  /**
   * Toggle sidebar on hamburger button click
   */
  toggleSidebar(e) {
    console.log(this.sidebarToggler.nativeElement.classList)
    this.sidebarToggler.nativeElement.classList.toggle('not-active');
    this.sidebarToggler.nativeElement.classList.toggle('active');
    if (window.matchMedia('(min-width: 992px)').matches) {
      e.preventDefault();
      this.document.body.classList.toggle('sidebar-folded');
    } else if (window.matchMedia('(max-width: 991px)').matches) {
      e.preventDefault();
      this.sidebarToggler.nativeElement.classList.toggle('not-active');
      this.sidebarToggler.nativeElement.classList.toggle('active');
      this.document.body.classList.toggle('sidebar-open');
    }
  }



  /**
   * Toggle settings-sidebar
   */
  toggleSettingsSidebar(e) {
    e.preventDefault();
    this.document.body.classList.toggle('settings-open');
  }


  /**
   * Open sidebar when hover (in folded folded state)
   */
  operSidebarFolded() {
    // if (this.document.body.classList.contains('sidebar-folded')){
    //   this.document.body.classList.add("open-sidebar-folded");
    //   console.log("folded");
    // }
  }


  /**
   * Fold sidebar after mouse leave (in folded state)
   */
  closeSidebarFolded() {
    // if (this.document.body.classList.contains('sidebar-folded')){
    //   this.document.body.classList.remove("open-sidebar-folded");
    // }
  }

  /**
   * Sidebar-folded on desktop (min-width:992px and max-width: 1199px)
   */
  iconSidebar(e) {
    if (e.matches && this.document.body.classList.contains("sidebar-folded")) {
      this.document.body.classList.add('sidebar-folded');
    } else {
      this.document.body.classList.remove('sidebar-folded');
    }
  }


  /**
   * Switching sidebar light/dark
   */
  onSidebarThemeChange(event) {
    this.document.body.classList.remove('sidebar-light', 'sidebar-dark');
    this.document.body.classList.add(event.target.value);
    this.document.body.classList.remove('settings-open');
  }


  /**
   * Returns true or false if given menu item has child or not
   * @param item menuItem
   */
  hasItems(item: MenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }


  /**
   * Reset the menus then hilight current active menu item
   */
  _activateMenuDropdown() {
    this.resetMenuItems();
    this.activateMenuItems();
  }


  /**
   * Resets the menus
   */
  resetMenuItems() {

    const links = document.getElementsByClassName('nav-link-ref');

    for (let i = 0; i < links.length; i++) {
      const menuItemEl = links[i];
      menuItemEl.classList.remove('mm-active');
      const parentEl = menuItemEl.parentElement;

      if (parentEl) {
          parentEl.classList.remove('mm-active');
          const parent2El = parentEl.parentElement;

          if (parent2El) {
            parent2El.classList.remove('mm-show');
          }

          const parent3El = parent2El.parentElement;
          if (parent3El) {
            parent3El.classList.remove('mm-active');

            if (parent3El.classList.contains('side-nav-item')) {
              const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

              if (firstAnchor) {
                firstAnchor.classList.remove('mm-active');
              }
            }

            const parent4El = parent3El.parentElement;
            if (parent4El) {
              parent4El.classList.remove('mm-show');

              const parent5El = parent4El.parentElement;
              if (parent5El) {
                parent5El.classList.remove('mm-active');
              }
            }
          }
      }
    }
  };


  /**
   * Toggles the menu items
   */
  activateMenuItems() {

    const links = document.getElementsByClassName('nav-link-ref');

    let menuItemEl = null;

    for (let i = 0; i < links.length; i++) {
      // tslint:disable-next-line: no-string-literal
        if (window.location.pathname === links[i]['pathname']) {

            menuItemEl = links[i];

            break;
        }
    }

    if (menuItemEl) {
        menuItemEl.classList.add('mm-active');
        const parentEl = menuItemEl.parentElement;

        if (parentEl) {
            parentEl.classList.add('mm-active');

            const parent2El = parentEl.parentElement;
            if (parent2El) {
                parent2El.classList.add('mm-show');
            }

            const parent3El = parent2El.parentElement;
            if (parent3El) {
                parent3El.classList.add('mm-active');

                if (parent3El.classList.contains('side-nav-item')) {
                    const firstAnchor = parent3El.querySelector('.side-nav-link-a-ref');

                    if (firstAnchor) {
                        firstAnchor.classList.add('mm-active');
                    }
                }

                const parent4El = parent3El.parentElement;
                if (parent4El) {
                    parent4El.classList.add('mm-show');

                    const parent5El = parent4El.parentElement;
                    if (parent5El) {
                        parent5El.classList.add('mm-active');
                    }
                }
            }
        }
    }
  };


}
