export const Search = {
  searchRegions(substr, regions) {
    let copyRegions = JSON.parse(JSON.stringify(regions));

    if (substr === '') {
      return copyRegions;
    }

    let regExpSubstr = new RegExp('(' + substr + ')', 'gi');

    let searchResult = copyRegions.filter((region) => {
      region.notInclude = false;
      if (region.name.toLowerCase().includes(substr.toLowerCase())) {
        region.name = region.name.replace(regExpSubstr, '<strong>$&</strong>');
      } else {
        region.notInclude = true;
      }

      if (Array.isArray(region.cities)) {
        region.cities = region.cities.filter((sity) => {
          if (sity.name.toLowerCase().includes(substr.toLowerCase())) {
            sity.name = sity.name.replace(regExpSubstr, '<strong>$&</strong>');
            return true;
          } else {
            return false;
          }
        });
        if (region.cities.length === 0) {
          region.cities = null;
        }
      }

      let noCities = !Array.isArray(region.cities) || region.cities === null;

      if (region.notInclude && noCities) {
        return false;
      }

      return true;
    });

    if (searchResult.length === 0) {
      return null;
    }

    return searchResult;
  },
};
