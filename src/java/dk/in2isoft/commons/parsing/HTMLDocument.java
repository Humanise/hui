
package dk.in2isoft.commons.parsing;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import nu.xom.Element;
import nu.xom.Text;

import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class HTMLDocument extends XMLDocument {

	private String title;
    private String contentType;
	
	public HTMLDocument(String url) throws MalformedURLException {
		super(url);
	}

	public HTMLDocument(URL url) {
		super(url);
	}
	
	public String getTitle() {
		if (this.title==null) {
			Document doc = getDOMDocument();
			NodeList titles = doc.getElementsByTagName("title");
			if (titles.getLength()>0) {
				Node titleNode = titles.item(0);
				Node text = titleNode.getFirstChild();
				if (text!=null) {
					this.title = text.getNodeValue();
				}
			}
		}
		return this.title;
	}
    
    public String getMeta(String key) {
        String value=null;
        Document doc = getDOMDocument();
        NodeList metas = doc.getElementsByTagName("meta");
        for (int i=0;i<metas.getLength();i++) {
            Node meta = metas.item(i);
            if (getAttributeValue(meta,"name").equalsIgnoreCase(key)) {
                value=getAttributeValue(meta,"content");
            }
            else if (getAttributeValue(meta,"http-equiv").equalsIgnoreCase(key)) {
                value=getAttributeValue(meta,"content");
            }
        }
        return value;
    }
	
	public String getContentType() {
		if (this.contentType==null) {
			Document doc = getDOMDocument();
			NodeList metas = doc.getElementsByTagName("meta");
			for (int i=0;i<metas.getLength();i++) {
				Node meta = metas.item(i);
				if (getAttributeValue(meta,"http-equiv").equalsIgnoreCase("content-type")) {
					contentType=getAttributeValue(meta,"content");
				}
			}
		}
		return this.contentType;
	}
    
    public String getFullText() {
        nu.xom.Document doc = getXOMDocument();
        return doc.getValue();
    }
    
    public String getText() {
        nu.xom.Document doc = getXOMDocument();
        StringBuffer data = new StringBuffer();
        traverse(doc,data);
        String text = data.toString();
        text = text.replaceAll("\\t"," ");
        text = text.replaceAll("\\s{2,}", " ");
        text = text.replaceAll("\\s{2,}", " ");
        return text;
    }
    
    private void traverse(nu.xom.Node parent, StringBuffer data) {
    	if (parent==null) return;
        int count = parent.getChildCount();
        for (int i=0;i<count;i++) {
            nu.xom.Node node = parent.getChild(i);
            if (node instanceof Text) {
                data.append(" ");
                data.append(node.getValue().trim());
            }
            else {
            	if (node instanceof Element) {
            		Element element = (Element) node;
            		if (!element.getLocalName().equals("script") && !element.getLocalName().equals("style")) {
                        traverse(node,data);            			
            		}
            	}
            }
        }
        
    }
	
	public List<HTMLReference> getReferences() {
		Document doc = getDOMDocument();
		NodeList list = doc.getElementsByTagName("a");
		List<HTMLReference> refs = new ArrayList<HTMLReference>();
	    for (int i=0;i<list.getLength();i++) {
	    	Node link = list.item(i);
	    	NamedNodeMap atts = link.getAttributes();
	    	Node href = atts.getNamedItem("href");
	    	Node title = atts.getNamedItem("title");
	    	HTMLReference ref = new HTMLReference();
	    	if (href!=null) {
	    		ref.setUrl(href.getNodeValue());
	    	}
	    	if (title!=null) {
	    		ref.setTitle(title.getNodeValue());
	    	}
	    	String text = "";
	    	NodeList children = link.getChildNodes();
	    	for (int j=0;j<children.getLength();j++) {
	    		Node child = children.item(j);
	    		if (child!=null && child.getNodeType()==Node.TEXT_NODE) {
	    			text+=child.getNodeValue();
	    		}
	    	}
	    	ref.setText(text);
	    	refs.add(ref);
	    }
	    return refs;
	}
	
	private String getAttributeValue(Node node, String name) {
		String out="";
    	NamedNodeMap atts = node.getAttributes();
    	Node att = atts.getNamedItem(name);
    	if (att!=null) {
    		out=att.getNodeValue();
    	}
		return out;
	}
}
