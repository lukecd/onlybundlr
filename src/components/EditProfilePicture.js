import React, { useState, useEffect } from "react";
import { WebBundlr } from "@bundlr-network/client";
import { upload } from "../utils/upload";
import { uploadImage } from "../utils/upload-image";

import { fetchSigner } from "wagmi/actions";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { useUpdateProfileImage } from "@lens-protocol/react";

const EditProfilePicture = ({ profile }) => {
	const [fileToUpload, setFileToUpload] = useState();
	const [fileType, setFileType] = useState();
	const {
		execute: updateProfileImage,
		error: updateProfileImageError,
		isPending: updateProfileImagePending,
	} = useUpdateProfileImage({
		profile,
	});

	const handleFile = async (e) => {
		const newFiles = e.target.files;
		if (newFiles.length === 0) return;

		setFileToUpload(newFiles[0]);
		setFileType(newFiles[0]["type"]);
	};

	const doUpdateProfilePicture = async () => {
		try {
			const newProfileURL = await uploadImage(fileToUpload, fileType);
			await updateProfileImage(newProfileURL);
		} catch (e) {
			console.log("error on update ", e);
		}
	};

	return (
		<div className="w-full mt-10 flex flex-col  bg-primary px-1 py-1 rounded-lg">
			<label className="block uppercase text-xs font-bold mb-2">Profile Picture</label>
			{profile?.picture && !fileToUpload && (
				<img
					src={profile.picture?.original.url.replace("ipfs://", "https://ipfs.io/ipfs/")}
					alt="profile_pic"
				/>
			)}
			{fileToUpload && <img src={URL.createObjectURL(fileToUpload)} alt="profile_pic" />}
			<div className="flex flex-row justify-start px-2 py-1 ">
				<input
					type="file"
					onChange={handleFile}
					className="px-2 text-sm text-white rounded-lg w-full"
					multiple="single"
					name="files[]"
				/>
				<div className="flex flex-row justify-end align-start w-full bg-primary ">
					<button
						className="font-main px-5 text-white rounded-lg bg-background hover:bg-secondary "
						onClick={() => doUpdateProfilePicture()}
					>
						upload
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditProfilePicture;