package dk.in2isoft.in2igui;

import java.io.File;

public class FileBasedInterface extends AbstractInterface {

	private File file;

	public FileBasedInterface(File file) {
		super();
		this.file = file;
	}

	@Override
	public File getFile() {
		return file;
	}

}
