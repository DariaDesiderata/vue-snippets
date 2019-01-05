<script>
import { get, set } from "lodash";
import { mapState, mapActions } from "vuex";
import { toggleSelectionMixin } from "../../common/mixins/toggleSelectionMixin.js";
import { setAndUnsetValuesMixin } from "../../common/mixins/setAndUnsetValuesMixin.js";

export default {
  name: "FunctionalSlotComponent",
  parent: "AccountDetailTable",
  mixins: [toggleSelectionMixin, setAndUnsetValuesMixin],
  props: {
    propsObject: {
      type: Object,
      required: true
    },
    requestItemData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    itemToUpdate: {
      get() {
        return this.requestItemData;
      },
      set(val) {
        return val;
      }
    },
    value: {
      get() {
        return get(this.itemToUpdate, this.propsObject.property);
      },
      set(val) {
        let props = this.propsObject.property.split(".");
        // added mixin here to set a nested property on an itemToUpdate object
        // we must use this.$set to trigger reactivity in Vue since the property is
        // being added dynamically to our itemToUpdate object
        this.setProp(this.itemToUpdate, props, val);
      }
    }
  },

  methods: {
    ...mapActions({
      // Vuex action to trigger a modal opening
      openAccountRequestDetailModal: "ui/openAccountRequestDetailModal"
    }),
    updateValue() {
      // since we are generating dynamic components (multiselect, select, input)
      // we must account for different input values and the way we update our state
      if (Array.isArray(this.value)) {
        let selectedValue =
          event.currentTarget.tagName === "I"
            ? event.target.parentElement.textContent.toLowerCase()
            : event.target.textContent.toLowerCase();
        // added a reusable mixin functionality to toggle on click value update
        this.toggleSelection(selectedValue);
      } else {
        // trigger set() value for single select and input
        this.value = event.target.textContent || event.target.value;
      }
      // once the value is updated we emit the new object to the parent component
      this.$emit("update", this.itemToUpdate);
    },
    handleOpenModal() {
      const modalType = this.propsObject.property.split(".")[0];
      // here we pass the type of modal and the id to open different modals with the same action
      // in our Vuex store we set the setShow${modalType} to true
      this.openAccountRequestDetailModal({
        modalType,
        requestItemId: this.itemToUpdate.id
      });
    }
  },
  // We use render function to programmatically generate multiple similar-type components
  // that receive different props

  render(h) {
    const {
      buttonCopy,
      filterable,
      multiple,
      property,
      showTooltip,
      type,
      value
    } = this.propsObject;
    const { disabled, options } = this.$attrs;
    if (type === "el-select") {
      return h(
        "el-select",
        {
          attrs: {
            multiple,
            size: "mini",
            filterable,
            disabled,
            class: "accountDetail__slot",
            value
          },
          props: {
            value: this.value
          },
          on: { change: this.updateValue }
        },
        [
          options.map(option =>
            h("el-option", {
              props: {
                key: option.value,
                value: option.value,
                label: option.label
              }
            })
          )
        ]
      );
    } else if (type === "el-button") {
      return h("el-button", {
        attrs: {
          size: "mini",
          plain: true,
          type: "primary",
          disabled
        },
        domProps: {
          innerHTML: buttonCopy
        },
        on: { click: this.handleOpenModal }
      });
    } else {
      return h(type, {
        attrs: {
          size: "mini",
          disabled,
          class: "accountDetail__slot"
        },
        on: { change: this.updateValue },
        props: {
          value: this.value
        }
      });
    }
  }
};
</script>
