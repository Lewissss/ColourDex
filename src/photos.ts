/** Private, device-local photographs. This module never makes a network request. */
export const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
const MAX_EDGE = 2048;
export type StoredPhoto = {slug:string; blob:Blob; width:number; height:number; updatedAt:number};
export function fitPhotoSize(width:number,height:number){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)throw Error('This image has invalid dimensions.');
  const scale=Math.min(1,MAX_EDGE/Math.max(width,height));
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
export function validatePhotoFile(file:{name:string;type:string;size:number}){
  if(!file.size)throw Error('This photo is empty. Please choose another image.');
  if(file.size>MAX_PHOTO_BYTES)throw Error('Please choose a photo smaller than 25 MB.');
  const allowed=/^image\/(jpeg|jpg|png|webp|avif|gif|heic|heif)$/i;
  if(file.type?!allowed.test(file.type):!(/\.(jpe?g|png|webp|avif|gif|heic|heif)$/i.test(file.name)))throw Error('Please choose a photo (JPEG, PNG, WebP or another supported image), not a document.');
}
export async function preparePhoto(file:File):Promise<Omit<StoredPhoto,'slug'|'updatedAt'>>{
  validatePhotoFile(file);
  const url=URL.createObjectURL(file),image=new Image();
  try{
    image.src=url;
    try{await image.decode();}catch{throw Error('Your browser could not open this photo. Please try a JPEG, PNG or WebP image.');}
    const size=fitPhotoSize(image.naturalWidth,image.naturalHeight),canvas=document.createElement('canvas');
    canvas.width=size.width;canvas.height=size.height;
    const context=canvas.getContext('2d');if(!context)throw Error('Photo processing is unavailable in this browser.');
    // Re-encoding removes the original EXIF/location metadata; browsers honour photo orientation when drawing.
    context.fillStyle='#ffffff';context.fillRect(0,0,size.width,size.height);context.drawImage(image,0,0,size.width,size.height);
    const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('Could not prepare this photo. Please try another image.')),'image/jpeg',.85));
    return {...size,blob};
  }finally{URL.revokeObjectURL(url);image.removeAttribute('src');}
}
let connection:Promise<IDBDatabase>|undefined;
function openDatabase(){
  if(connection)return connection;
  connection=new Promise<IDBDatabase>((resolve,reject)=>{
    if(!globalThis.indexedDB){reject(Error('Photo storage is unavailable in this browser.'));return;}
    let settled=false;const request=indexedDB.open('poc-private-photos-v1',1);
    const timer=setTimeout(()=>{if(!settled){settled=true;reject(Error('Photo storage could not be opened. Close other tabs and try again.'));}},8000);
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('photos'))request.result.createObjectStore('photos',{keyPath:'slug'});};
    request.onsuccess=()=>{clearTimeout(timer);if(settled){request.result.close();return;}settled=true;const db=request.result;db.onversionchange=()=>{db.close();connection=undefined;};resolve(db);};
    request.onerror=()=>{clearTimeout(timer);if(!settled){settled=true;reject(request.error||Error('Photo storage is unavailable.'));}};
    request.onblocked=()=>{clearTimeout(timer);if(!settled){settled=true;reject(Error('Close other Pokédex tabs, then try adding your photo again.'));}};
  }).catch(error=>{connection=undefined;throw error;});
  return connection;
}
export async function loadPhotos():Promise<StoredPhoto[]>{
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{const tx=db.transaction('photos','readonly'),request=tx.objectStore('photos').getAll();request.onsuccess=()=>resolve(request.result.filter((p:StoredPhoto)=>typeof p.slug==='string'&&p.blob instanceof Blob));request.onerror=()=>reject(request.error);tx.onabort=()=>reject(tx.error||Error('Could not read stored photographs.'));});
}
async function writePhoto(slug:string,photo?:Omit<StoredPhoto,'slug'|'updatedAt'>){
  const db=await openDatabase();
  return new Promise<void>((resolve,reject)=>{
    const tx=db.transaction('photos','readwrite');tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||Error('Could not save your photo.'));tx.onabort=()=>reject(tx.error||Error('Photo storage is full or unavailable.'));
    if(photo)tx.objectStore('photos').put({slug,...photo,updatedAt:Date.now()});else tx.objectStore('photos').delete(slug);
  });
}
export const savePhoto=(slug:string,photo:Omit<StoredPhoto,'slug'|'updatedAt'>)=>writePhoto(slug,photo);
export const deletePhoto=(slug:string)=>writePhoto(slug);
