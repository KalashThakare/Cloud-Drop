import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'cancelled'],
        default: 'active'
    },
    // Usage tracking for free plan limits
    filesUploaded: {
        type: Number,
        default: 0
    },
    signedUrlsGenerated: {
        type: Number,
        default: 0
    },
    groupsCreated: {
        type: Number,
        default: 0
    },
    // Payment related fields (for future use)
    razorpayCustomerId: {
        type: String,
        default: null
    },
    razorpaySubscriptionId: {
        type: String,
        default: null
    },
    currentPeriodStart: {
        type: Date,
        default: Date.now
    },
    currentPeriodEnd: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setMonth(date.getMonth() + 1);
            return date;
        }
    },
    // Reset usage counters monthly
    lastResetDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Reset usage counters if it's a new month
subscriptionSchema.methods.resetUsageIfNeeded = function() {
    const now = new Date();
    const lastReset = new Date(this.lastResetDate);
    
    // Check if we're in a new month
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        this.filesUploaded = 0;
        this.signedUrlsGenerated = 0;
        this.groupsCreated = 0;
        this.lastResetDate = now;
        this.currentPeriodStart = now;
        
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.currentPeriodEnd = nextMonth;
        
        return this.save();
    }
    return Promise.resolve(this);
};

// Check if user can perform action based on plan limits
subscriptionSchema.methods.canPerformAction = function(action) {
    if (this.plan === 'pro') {
        return { allowed: true, message: 'Pro plan - unlimited access' };
    }

    // Free plan limits
    const limits = {
        fileUpload: 15,
        signedUrl: 15,
        groupCreation: 3
    };

    switch (action) {
        case 'fileUpload':
            if (this.filesUploaded >= limits.fileUpload) {
                return { 
                    allowed: false, 
                    message: `Free plan limit reached. You can upload maximum ${limits.fileUpload} files per month.`,
                    current: this.filesUploaded,
                    limit: limits.fileUpload
                };
            }
            return { allowed: true };
            
        case 'signedUrl':
            if (this.signedUrlsGenerated >= limits.signedUrl) {
                return { 
                    allowed: false, 
                    message: `Free plan limit reached. You can generate maximum ${limits.signedUrl} signed URLs per month.`,
                    current: this.signedUrlsGenerated,
                    limit: limits.signedUrl
                };
            }
            return { allowed: true };
            
        case 'groupCreation':
            if (this.groupsCreated >= limits.groupCreation) {
                return { 
                    allowed: false, 
                    message: `Free plan limit reached. You can create maximum ${limits.groupCreation} groups.`,
                    current: this.groupsCreated,
                    limit: limits.groupCreation
                };
            }
            return { allowed: true };
            
        default:
            return { allowed: true };
    }
};

// Increment usage counter
subscriptionSchema.methods.incrementUsage = async function(action) {
    await this.resetUsageIfNeeded();
    
    switch (action) {
        case 'fileUpload':
            this.filesUploaded += 1;
            break;
        case 'signedUrl':
            this.signedUrlsGenerated += 1;
            break;
        case 'groupCreation':
            this.groupsCreated += 1;
            break;
    }
    
    return this.save();
};

// Get usage statistics
subscriptionSchema.methods.getUsageStats = function() {
    const limits = this.plan === 'pro' ? 
        { fileUpload: 'unlimited', signedUrl: 'unlimited', groupCreation: 'unlimited' } :
        { fileUpload: 15, signedUrl: 15, groupCreation: 3 };

    return {
        plan: this.plan,
        status: this.status,
        usage: {
            filesUploaded: {
                current: this.filesUploaded,
                limit: limits.fileUpload
            },
            signedUrlsGenerated: {
                current: this.signedUrlsGenerated,
                limit: limits.signedUrl
            },
            groupsCreated: {
                current: this.groupsCreated,
                limit: limits.groupCreation
            }
        },
        currentPeriod: {
            start: this.currentPeriodStart,
            end: this.currentPeriodEnd
        }
    };
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;