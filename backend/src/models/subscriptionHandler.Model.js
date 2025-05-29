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
    // Payment related fields (connected to your other system)
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
    // Pro plan has unlimited access
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
                    message: `Free plan limit reached. You can upload maximum ${limits.fileUpload} files per month. Upgrade to Pro for unlimited access.`,
                    current: this.filesUploaded,
                    limit: limits.fileUpload
                };
            }
            return { allowed: true };
            
        case 'signedUrl':
            if (this.signedUrlsGenerated >= limits.signedUrl) {
                return { 
                    allowed: false, 
                    message: `Free plan limit reached. You can generate maximum ${limits.signedUrl} signed URLs per month. Upgrade to Pro for unlimited access.`,
                    current: this.signedUrlsGenerated,
                    limit: limits.signedUrl
                };
            }
            return { allowed: true };
            
        case 'groupCreation':
            if (this.groupsCreated >= limits.groupCreation) {
                return { 
                    allowed: false, 
                    message: `Free plan limit reached. You can create maximum ${limits.groupCreation} groups. Upgrade to Pro for unlimited access.`,
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
        },
        // Include payment info if available
        paymentInfo: {
            razorpayCustomerId: this.razorpayCustomerId,
            razorpaySubscriptionId: this.razorpaySubscriptionId
        }
    };
};

// Check if subscription has expired (for paid plans)
subscriptionSchema.methods.isExpired = function() {
    if (this.plan === 'free') return false;
    return new Date() > this.currentPeriodEnd;
};

// Sync with user model subscription data
subscriptionSchema.methods.syncWithUserModel = async function() {
    try {
        const User = mongoose.model('User');
        const user = await User.findById(this.userId);
        
        if (user && user.subscription) {
            // If user subscription has expired, downgrade to free
            if (user.subscription.endsAt && new Date() > user.subscription.endsAt) {
                this.plan = 'free';
                this.status = 'active';
                this.razorpaySubscriptionId = null;
                
                // Also update user model
                await User.findByIdAndUpdate(this.userId, {
                    'subscription.isActive': false
                });
            } else if (user.subscription.isActive && user.subscription.plan) {
                // Sync plan type based on user's active subscription
                const SubscriptionPlan = mongoose.model('SubscriptioModel');
                const planDetails = await SubscriptionPlan.findById(user.subscription.plan);
                
                if (planDetails) {
                    this.plan = planDetails.isFree ? 'free' : 'pro';
                    this.razorpaySubscriptionId = user.subscription.razorpaySubId || null;
                }
            }
            
            await this.save();
        }
        
        return this;
    } catch (error) {
        console.error('Error syncing subscription:', error);
        return this;
    }
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;