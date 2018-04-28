#!/usr/bin/env ruby
require 'pathname'


class Component
  attr_accessor :name, :modern, :sass_path
end

class Thing
  def run
    file_path = Pathname.new($0).realpath()
    hui_path = file_path.parent.dirname

    components = list_dir hui_path
    check_graphics hui_path
    components.each { |component|
      puts component.name + (component.modern ? "+" : "")
      puts "  " + (component.sass_path || "none")
    }
  end

  def list_dir directory
    js_dir = directory.join("js")
    components = []
    js_dir.children.select{|item| !File.directory?(item)}.sort_by!{|obj| obj.basename.to_s.downcase}.each { |child|
      data = File.read(child)
      name = child.basename.to_s[0..-4]
      if /^[A-Z]+/m.match(name) != nil
        component = Component.new
        component.name = name
        component.modern = data.match?(/hui\.ui\.Component/)
        sass_path = directory.join("scss/" + name.downcase + ".scss")
        if sass_path.exist?
          component.sass_path = sass_path.to_s
        end
        components.push component
      end
    }
    return components
  end

  def check_graphics directory
    all_css = File.read(directory.join("bin/joined.css"))
    gfx_dir = directory.join("gfx")
    gfx_dir.children.select{|item| !File.directory?(item)}.sort_by!{|obj| obj.basename.to_s.downcase}.each { |file|
      if all_css.index(file.basename.to_s) == nil 
        puts file.basename
      end
    }
  end

end

Thing.new.run