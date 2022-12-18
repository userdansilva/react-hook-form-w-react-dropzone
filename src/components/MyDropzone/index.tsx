import { useDropzone } from "react-dropzone";
import {
  useForm, Controller, FormProvider, useFormContext,
} from "react-hook-form";

interface DropzoneProps {
  onDrop: any;
}

function Dropzone({ onDrop }: DropzoneProps) {
  const { getRootProps, getInputProps } = useDropzone(
    { multiple: true, onDrop },
  );

  return (
    <div
      className="w-full rounded-lg border-2 border-dashed border-slate-300"
      {...getRootProps()}
    >
      <div className="p-10 text-center text-slate-300">
        Dropzone
      </div>

      <input {...getInputProps()} />
    </div>
  );
}

const addIfNew = (acc: File[], currFile: File) => {
  const isNew = !acc.find(
    ({ name: fileName }) => fileName === currFile.name,
  );

  if (!isNew) {
    return acc;
  }

  return [...acc, currFile];
};

interface DropzoneFieldProps {
  name: string;
}

function DropzoneField({ name }: DropzoneFieldProps) {
  const { control, watch, setValue } = useFormContext();
  const currentFiles = watch(name);
  const files = Object.values(currentFiles || []) as File[];

  const lastPosition = files.length - 1;
  const hasLengthProp = typeof files[lastPosition] === "number";

  if (hasLengthProp) {
    files.pop();
  }

  function removeFile(fileName: string) {
    const currFiles = [...files];
    const fileIndex = currFiles.findIndex((file) => file.name === fileName);

    currFiles.splice(fileIndex, 1);

    setValue(name, { ...currFiles });
  }

  return (
    <div>
      <Controller
        render={({ field: { onChange } }) => (
          <Dropzone
            onDrop={(filesArray: File[]) => {
              const allFiles = [...filesArray, ...files];
              const newFiles = allFiles.reduce(addIfNew, []);
              const newFilesObj = { ...newFiles, length: newFiles.length };

              onChange(newFilesObj);
            }}
          />
        )}
        name={name}
        control={control}
        defaultValue=""
      />

      <ul className="grid grid-cols-2 gap-5 mt-5">
        {files.map(({ name: fileName }) => (
          <li
            key={fileName}
            className="flex items-center gap-3 bg-slate-200 rounded-lg p-5"
          >
            <div className="flex-1 truncate">
              {fileName}
            </div>

            <button
              type="button"
              onClick={() => removeFile(fileName)}
              className="bg-slate-300 px-2 py-1 rounded-lg"
            >
              remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MyDropzone() {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(console.log)}
        className="flex flex-col gap-8"
      >
        <h1 className="font-semibold text-2xl">
          React Hook Form + React Dropzopne
        </h1>

        <DropzoneField name="dropzone" />

        <div>
          <button
            type="submit"
            className="bg-violet-600 text-white py-2 px-4 rounded-lg"
          >
            Submit
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

export { MyDropzone };
