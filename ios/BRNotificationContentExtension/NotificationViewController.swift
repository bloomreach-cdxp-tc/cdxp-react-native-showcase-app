import UIKit
import UserNotifications
import UserNotificationsUI
import ExponeaSDK_Notifications // we'll add this pod later

class NotificationViewController: UIViewController, UNNotificationContentExtension {
    let exponeaService = ExponeaNotificationContentService()

    func didReceive(_ notification: UNNotification) {
        exponeaService.didReceive(notification, context: extensionContext, viewController: self)
    }
}
