package dk.in2isoft.onlineobjects.model;

public enum Kind {
    answers ("information.answers"),
    similarity ("common.similarity");

    private final String name;       

    private Kind(String s) {
        name = s;
    }

    public boolean equalsName(String otherName) {
        return (otherName == null) ? false : name.equals(otherName);
    }

    public String toString() {
       return this.name;
    }
}
