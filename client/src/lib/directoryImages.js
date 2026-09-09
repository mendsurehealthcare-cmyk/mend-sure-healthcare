import directoryImages from '../data/directory-images.json';

/*
  Resolves the photograph to show for a doctor or hospital.

  The row's own `image_url` wins whenever it is set, so a photograph uploaded
  through the database still overrides everything. Otherwise the record falls
  back to the file the build script wrote for its slug — see
  `npm run build:images`. A record with neither returns null, and CardMedia
  paints its tinted panel instead.
*/
function resolve(kind, record) {
  return record?.image_url || directoryImages[kind][record?.slug] || null;
}

export const doctorImage = (doctor) => resolve('doctors', doctor);
export const hospitalImage = (hospital) => resolve('hospitals', hospital);
