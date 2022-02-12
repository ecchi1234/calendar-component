import { debounce } from "@react3l/react3l/helpers";

// import "froala-editor/js/plugins/fullscreen.min.js"

// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/third_party/embedly.min.js";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/third_party/embedly.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import React, { MutableRefObject } from "react";
// import "froala-editor/css/plugins/fullscreen.min.css";
import Froala from "react-froala-wysiwyg";

import Tribute from "tributejs"; // TODO: @abdullah remove atwho code and update StringHelper.simpleFormat
import "tributejs/dist/tribute.css";

import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min.js";
import "./FroalaEditor.scss";
import { Model, ModelFilter } from "@react3l/react3l/core";
import { ErrorObserver, Observable } from "rxjs";
import { commonService } from "@react3l/react3l/services";

export interface FroalaEditorProps<
  T extends Model,
  TModelFilter extends ModelFilter
  > {
  value?: string;

  className?: string;

  editorConfig?: Record<string, any>;

  onChange?(value: string): void;

  placeholder?: string;

  getList?: (TModelFilter?: TModelFilter) => Observable<T[]>;

  classFilter?: new () => TModelFilter;

  modelFilter?: TModelFilter;
}

const FroalaEditorComponent = React.forwardRef(
  (
    props: FroalaEditorProps<Model, ModelFilter>,
    ref: MutableRefObject<any>
  ) => {
    const {
      value = null,
      onChange,
      placeholder,
      getList,
      modelFilter,
      classFilter: ClassFilter,
    } = props;

    const [subscription] = commonService.useSubscription();

    const handleLoadList = React.useCallback(
      (cb) => {
        try {
          subscription.add(getList);
          const filter = modelFilter ? { ...modelFilter } : new ClassFilter();
          getList(filter).subscribe(
            (res: Model[]) => {
              cb(res);
            },
            (err: ErrorObserver<Error>) => {
              cb([]);
            }
          );
        } catch (error) { }
      },
      [subscription, getList, modelFilter, ClassFilter]
    );

    const handleChange = React.useCallback(
      debounce((...[content]: any) => {
        if (typeof onChange === "function") {
          onChange(content);
        }
      }),
      [onChange]
    );

    const tribute = new Tribute({
      values: (...[, cb]) => {
        handleLoadList((users) => cb(users));
      },
      lookup: "name",
      fillAttr: "name",

      selectTemplate: (item) => {
        return (
          '<span class="fr-deletable fr-tribute">' +
          item?.original["code"] +
          "</a></span>"
        );
      },
    });

    const config = {
      attribution: false,
      placeholderText: placeholder,
      toolbarButtons: {
        moreText: {
          buttons: [
            "bold",
            "italic",
            "underline",
            "strikeThrough",
            "subscript",
            "superscript",
            "fontFamily",
            "fontSize",
            "textColor",
            "backgroundColor",
            "inlineClass",
            "inlineStyle",
            "clearFormatting",
          ],
        },
        moreParagraph: {
          buttons: [
            "alignLeft",
            "alignCenter",
            "formatOLSimple",
            "alignRight",
            "alignJustify",
            "formatOL",
            "formatUL",
            "paragraphFormat",
            "paragraphStyle",
            "lineHeight",
            "outdent",
            "indent",
            "quote",
          ],
        },
        moreRich: {
          buttons: [
            "insertLink",
            "insertImage",
            "insertVideo",
            "insertTable",
            "emoticons",
            "fontAwesome",
            "specialCharacters",
            "embedly",
            "insertFile",
            "insertHR",
          ],
        },
        moreMisc: {
          buttons: [
            "undo",
            "redo",
            "fullscreen",
            "print",
            "getPDF",
            "spellChecker",
            "selectAll",
            "html",
            "help",
          ],
          align: "right",
          buttonsVisible: 2,
        },
      },
      pluginsEnabled: [
        "table",
        "spell",
        "quote",
        "save",
        "quickInsert",
        "paragraphFormat",
        "paragraphStyle",
        "help",
        "draggable",
        "align",
        "link",
        "lists",
        "file",
        "image",
        "emoticons",
        "url",
        "video",
        "embedly",
        "colors",
        "entities",
        "inlineClass",
        "inlineStyle",
        "imageTUI",
      ],
      events: {
        initialized: function () {
          var editor = this;

          tribute.attach(editor.el);

          editor.events.on(
            "keydown",
            function (e) {
              if (e.which === FroalaEditor.KEYCODE.ENTER) {
                return false;
              }
            },
            true
          );
        },
      },
    };

    // React.useEffect(() => {
    //   setTimeout(() => {
    //     const froala = document.getElementsByClassName("fr-wrapper")[0] as HTMLElement;
    //     const placeHolder = document.getElementsByClassName("fr-placeholder")[0] as HTMLElement;
    //     froala.firstElementChild.remove();
    //     placeHolder.style.marginTop = '0px';
    //   }, 100);
    // });

    return (
      <Froala
        ref={ref}
        model={value}
        onModelChange={handleChange}
        tag="textarea"
        config={config}
      />
    );
  }
);

export default FroalaEditorComponent;
