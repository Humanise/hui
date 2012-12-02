package dk.in2isoft.onlineobjects.model.conversion;

import java.util.List;

import nu.xom.Element;
import nu.xom.Node;
import dk.in2isoft.onlineobjects.core.Core;
import dk.in2isoft.onlineobjects.core.exceptions.ModelException;
import dk.in2isoft.onlineobjects.model.Entity;
import dk.in2isoft.onlineobjects.model.Image;
import dk.in2isoft.onlineobjects.model.ImagePart;

public class ImagePartConverter extends EntityConverter {

	@Override
	protected Node generateSubXML(Entity entity) throws ModelException {
		ImagePart part = (ImagePart) entity;
		Element root = new Element("ImagePart",ImagePart.NAMESPACE);
		List<Image> children = Core.getInstance().getModel().getChildren(part, Image.class);
		for (Image image : children) {
			Node node = Core.getInstance().getConversionService().generateXML(image);
			root.appendChild(node);
		}
		return root;
	}

}
