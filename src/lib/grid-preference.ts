export type GridDensity = 'comfortable' | 'dense';

export const GRID_STORAGE_KEY = 'picky:grid';

export const gridPreferenceScript = `try{if(localStorage.getItem('${GRID_STORAGE_KEY}')==='dense')document.documentElement.dataset.grid='dense'}catch(e){}`;
