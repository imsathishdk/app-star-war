import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-detail-view-dialog',
  templateUrl: './detail-view-dialog.component.html',
  styleUrls: ['./detail-view-dialog.component.scss']
})
export class DetailViewDialogComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() isOpen: boolean = false;
  @Input() dataSource: any;
  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  closeModal() {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

}
