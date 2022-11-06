import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  public downloadAsPDF(htmltags:string,callback:Function) {
    const doc = new jsPDF('p','pt','a4');
    const options = {
      background: 'white',
      scale: 3
    };
    let element:HTMLElement=this.createElementFromHTML(htmltags);
    let topElement:HTMLElement = document.createElement('div');
    document.body.prepend(topElement);
    document.body.appendChild(element);
    topElement.scrollIntoView();
    topElement.remove();
    /*document.body.style.overflow="hidden";*/
    html2canvas(element, options).then((canvas) => {
        var img = canvas.toDataURL("image/PNG");
        const bufferX = 5;
        const bufferY = 5;
        const imgProps = doc.getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
        return doc;
      }).then((doc) => {
        doc.save('demande de participation et engagement.pdf');  
      }).finally(()=>{
        document.body.style.overflow="auto";
        element.remove();
        callback();
      });
  }

  private createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div; 
  }
}
