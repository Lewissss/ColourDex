import test from 'node:test';
import assert from 'node:assert/strict';
import {fitPhotoSize,validatePhotoFile,MAX_PHOTO_BYTES} from '../src/photos.ts';
test('large phone photographs retain their aspect ratio within the storage size limit',()=>{assert.deepEqual(fitPhotoSize(4032,3024),{width:2048,height:1536});assert.deepEqual(fitPhotoSize(3024,4032),{width:1536,height:2048});});
test('small photographs are never upscaled',()=>assert.deepEqual(fitPhotoSize(640,480),{width:640,height:480}));
test('extreme dimensions remain at least one pixel and invalid dimensions fail',()=>{assert.deepEqual(fitPhotoSize(1,9000),{width:1,height:2048});for(const dimensions of [[0,200],[NaN,20],[200,Infinity],[-1,2]])assert.throws(()=>fitPhotoSize(...dimensions));});
test('phone photo formats and valid files with missing MIME types can be decoded',()=>{for(const [name,type] of [['photo.jpg','image/jpeg'],['photo.heic','image/heic'],['photo.png','image/png'],['photo.webp','image/webp'],['photo.JPEG','']])assert.doesNotThrow(()=>validatePhotoFile({name,type,size:1024}));});
test('non-images and SVG documents cannot enter the private photo store',()=>{for(const [name,type] of [['photo.svg','image/svg+xml'],['notes.txt','text/plain'],['fake.jpg','text/html']])assert.throws(()=>validatePhotoFile({name,type,size:1024}),/photo|image/i);});
test('empty or oversized selections fail before decoding and the maximum is accepted',()=>{assert.throws(()=>validatePhotoFile({name:'photo.jpg',type:'image/jpeg',size:0}),/empty/i);assert.throws(()=>validatePhotoFile({name:'photo.jpg',type:'image/jpeg',size:MAX_PHOTO_BYTES+1}),/25 MB/);assert.doesNotThrow(()=>validatePhotoFile({name:'photo.jpg',type:'image/jpeg',size:MAX_PHOTO_BYTES}));});
