// render components dynamically based on the step

<div class="requestWizard__component-wrapper">
    <transition name="fadeIn">
        <keep-alive>
            <component
            : is="activeComponent.componentName"
            :copy="activeComponent.componentCopy"
            :send-data-to-store-fn="setDataToSend"
            />
    </keep-alive>
    </transition>
</div>

// methods to get the next step and previous step

getNextStep = () => {
    this.disableNextButton = true;
    if (this.activeStep++ >= 5) return;
    // dynamically assign activeComponent based on activeStep
    this.activeComponent = this.getComponent(this.activeStep);
    // trigger state mutation with data returned by child component (location, overview, etc)
    this.setRequestBase(this.dataToSendToStore);
    this.dataToSendToStore = '';
    // set items in the store with the minimum required info
    if (this.requestItems && this.requestItems.length) {
        this.setRequestItems(this.requestItems);
    }
}

getPrevStep = () => {
    this.disableNextButton = false;
    // re-route to dashboard results on the first 'back' button click
    if (this.activeStep-- === 0) {
        this.$router.push({
            path: 'request-dashboard',
        });
    }
    this.activeComponent = this.getComponent(this.activeStep);
}


  /* Sample animations */

.fadeIn - enter - active {
    transition: opacity 0.2s ease -in;
}
.fadeIn - enter,
.fadeIn - leave - to {
    opacity: 0;
}

<transition name="bounceIn">
    <i v-show="activeFields[button.fieldToUpdate] === button.value"
        class="el-icon-success active" />
</transition>

.bounceIn - enter - active {
    animation: bounceIn 0.25s cubic - bezier(1, 0.5, 0.8, 1);
}

@keyframes bounceIn {
    0 % {
        opacity: 0;
        transform: scale(0.3) translate3d(0, 0, 0);
    }
    50 % {
        opacity: 0.9;
        transform: scale(1.1);
    }
    80 % {
        opacity: 1;
        transform: scale(0.89);
    }
    100 % {
        opacity: 1;
        transform: scale(1) translate3d(0, 0, 0);
    }
}