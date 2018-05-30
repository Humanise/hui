#!/usr/bin/env ruby
require 'pathname'
require 'json'


class Component
  attr_accessor :name, :modern, :sass_path, :css_path, :html_example_path
end

class Inspector

  def inspect(hui_path)

    components = list_dir hui_path
    check_graphics hui_path
    components.each { |component|
      puts component.name + (component.modern ? "+" : "")
      puts "  " + (component.sass_path ? component.sass_path.to_s : "none")
    }
    json = JSON.pretty_generate(components.map {|component|
      obj = {name: component.name}
      if component.sass_path
        obj[:sass] = component.sass_path.basename.to_s
      end
      if component.css_path
        obj[:css] = component.css_path.basename.to_s
      end
      if component.html_example_path
        obj[:htmlSample] = component.html_example_path.basename.to_s
      end
      obj
    })
    File.write(hui_path.join("info/components.json"), json)
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
        component.sass_path = sass_path if sass_path.exist?
        css_path = directory.join("css/" + name.downcase + ".css")
        component.css_path = css_path if css_path.exist?
        html_test_path = directory.join("test/html/" + name.downcase + ".html")
        component.html_example_path = html_test_path if html_test_path.exist?
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

file_path = Pathname.new($0).realpath()

Inspector.new.inspect(file_path.parent.dirname)