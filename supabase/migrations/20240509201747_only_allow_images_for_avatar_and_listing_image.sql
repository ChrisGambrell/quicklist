update storage.buckets set allowed_mime_types='{"image/*"}' where name='avatars';
update storage.buckets set allowed_mime_types='{"image/*"}' where name='listing_images';
