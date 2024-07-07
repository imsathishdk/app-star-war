import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ApiConstant } from 'src/app/Constants/api-constant';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  people: any;
  films: any;
  form: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();
  peopleList: any;
  planentList: any;
  filmList: any;
  speciecList: any;
  vehicleList: any;
  starshipList: any;
  openDialog: boolean = false;
  defaultGridList: { name: string, species: string, birth_year: string }[] = [];
  details: any;
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.initializeForm();
    this.loadDataFromApi();
  }
  initializeForm() {
    this.form = new FormGroup({
      title: new FormControl(''),
      species: new FormControl(''),
      vehicle: new FormControl(''),
      starship: new FormControl(''),
      birthYear: new FormControl('')
    })
  }
  loadDataFromApi() {

    forkJoin([
      this.httpService.get(ApiConstant.GET_PEOPLE_DETAILS),
      this.httpService.get(ApiConstant.GET_PLANET_DETAILS),
      this.httpService.get(ApiConstant.GET_FILM_DETAILS),
      this.httpService.get(ApiConstant.GET_SPECIES_DETAILS),
      this.httpService.get(ApiConstant.GET_VECHICLES_DETAILS),
      this.httpService.get(ApiConstant.GET_STARSHIP_DETAILS),
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([peopleList, planentList, filmList, speciecList, vehicleList, starshipList]) => {
        this.peopleList = peopleList.results;
        this.planentList = planentList.results;
        this.filmList = filmList.results;
        this.speciecList = speciecList.results;
        this.vehicleList = vehicleList.results;
        this.starshipList = starshipList.results;
        this.peopleList.forEach((person: any, index: number) => {

          let gridItem = {
            name: person.name,
            species: person.species[0] ? this.speciecList[this.extractNumberFromUrl(person.species[0])].name : '',
            birth_year: person.birth_year
          }
          this.defaultGridList.push(gridItem);
        })
      }
    })
  }

  extractNumberFromUrl(url: string): number {
    const regex = /\/(\d+)\/$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return +(match[1]) - 1;
    }
    return -1
  }

  search() {
    this.openDialog = true;
  }
  reset() {
    this.form.reset();
  }

  openDetailView(index: number) {
    this.openDialog = false;
    this.details = {
      people: this.peopleList[index]
    }
    this.openDialog = true;
  }

  onModalStateChanged(isOpen: boolean) {
    this.openDialog = isOpen;
  }

  paginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.defaultGridList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getTotalPages() {
    return Math.ceil(this.defaultGridList.length / this.itemsPerPage);
  }

  getPageNumbers() {
    return Array(this.getTotalPages()).fill(0).map((_, index) => index + 1);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}