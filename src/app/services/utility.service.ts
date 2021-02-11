import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  requestHeaders() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
    return httpOptions;
  }

  validateDob(userDob, newDob) {
    let splittedUserDob = userDob.split('T');
    let matchResult = splittedUserDob[0] === newDob ? true : false;
    return matchResult;
  }

  convertDateFormat(dateToConvert) {
    var converteddate = new Date(dateToConvert),
      month = ("0" + (converteddate.getMonth() + 1)).slice(-2),
      day = ("0" + converteddate.getDate()).slice(-2);
    return [converteddate.getFullYear(), month, day].join("-");
  }

  dateDifference(oldDate) {
    oldDate = Date.parse(oldDate);
    let diffInSeconds = Math.floor(Date.now() - oldDate) / 1000;
    let result;

    if (diffInSeconds >= 60) {
      result = (diffInSeconds / 60);

      if (result >= 60) {
        result = result / 60;

        if (result >= 24) {
          result = result / 24;
          result = Math.floor(result);
          let suffix = result === 1 ? ' day' : ' days';
          return (result + suffix);
        }

        result = Math.floor(result);
        let suffix = result === 1 ? ' hour' : ' hours';
        return (result + suffix);
      }

      result = Math.floor(result);
      let suffix = result === 1 ? ' minute' : ' minutes';
      return (result + suffix);
    }

    diffInSeconds = Math.floor(diffInSeconds);
    let suffix = diffInSeconds === 1 ? ' second' : ' seconds';
    return (diffInSeconds + suffix);
  }
}
